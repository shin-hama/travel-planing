import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { DocumentReference } from 'firebase/firestore'

import DayHeader from './DayHeader'
import RouteEvent from './Route'
import { Route, RouteGuidanceAvailable } from 'contexts/CurrentPlanProvider'
import DayMenu from './DayMenu'
import { usePlan } from 'hooks/usePlan'
import HomeEventCard from './HomeEventCard'
import AddEventCard from './AddEventCard'
import { usePlanningTab } from 'contexts/PlanningTabProvider'
import { Schedule } from 'hooks/useSchedules'
import { useDocument } from 'hooks/firebase/useDocument'
import { useEvents } from 'hooks/useEvents'
import SpotEvent from './SpotEvent'

type Props = {
  day: number
  schedule: DocumentReference<Schedule>
  first?: boolean
  last?: boolean
}
const DayColumn: React.FC<Props> = ({
  day,
  schedule: scheduleRef,
  first,
  last,
}) => {
  const [plan, planApi] = usePlan()
  const [schedule, scheduleApi] = useDocument(scheduleRef)
  const [events] = useEvents(scheduleRef)
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)
  const [, { openMap }] = usePlanningTab()

  const home = React.useMemo<RouteGuidanceAvailable | null>(() => {
    if (plan && schedule) {
      if (first) {
        return { ...plan.home, next: schedule.dept }
      } else if (plan.lodging) {
        return { ...plan.lodging, next: schedule.dept }
      }
    }

    return null
  }, [first, plan, schedule])

  const dest = React.useMemo<RouteGuidanceAvailable | null>(() => {
    if (plan && schedule) {
      if (last) {
        return { ...plan.home, next: schedule.dept }
      } else if (plan.lodging) {
        return { ...plan.lodging, next: schedule.dept }
      } else {
        return null
      }
    }

    return null
  }, [last, plan, schedule])

  // const { routesApi } = useRoutes()

  // const summarizeTotalTime = (): Date => {
  //   const _start = dayjs(schedule?.start)
  //   prevSpots.forEach((prev) => {
  //     // このスポットよりも前にスケジュールされているスポットの滞在時間と移動時間を加算
  //     const nextRoute =
  //       prev.next &&
  //       routesApi.get({
  //         from: prev.id,
  //         to: prev.next.id,
  //         mode: prev.next.mode,
  //       })
  //     _start = _start
  //       .add(prev.duration, prev.durationUnit)
  //       .add(nextRoute?.time?.value || 0, nextRoute?.time?.unit)
  //   })

  //   if (home && schedule.dept) {
  //     const deptRoute = routesApi.get({
  //       from: home.id,
  //       to: schedule.dept.id,
  //       mode: schedule.dept.mode,
  //     })
  //     _start = _start.add(deptRoute?.time?.value || 0, deptRoute?.time?.unit)
  //   }
  //   return _start.toDate()
  // }

  const handleRemoveDay = () => {
    planApi.update({
      events: plan?.events.filter((_, i) => i !== plan.events.length - 1),
    })
  }

  const handleOpenMenu = (anchor: HTMLElement) => {
    setAnchor(anchor)
  }

  const handleUpdateDeparture = React.useCallback(
    (route: Route) => {
      scheduleApi.update({
        dept: route,
      })
    },
    [scheduleApi]
  )

  if (!schedule) {
    return <>NO Referenced schedule</>
  }

  return (
    <>
      <Droppable droppableId={day.toString()} type="ITEM" direction="vertical">
        {(provided) => (
          <Stack
            spacing={1}
            width="320px"
            height="100%"
            ref={provided.innerRef}
            {...provided.droppableProps}>
            <DayHeader
              day={day + 1}
              schedule={schedule}
              onOpenMenu={handleOpenMenu}
              onChangeSchedule={scheduleApi.update}
            />
            <Box>
              {home && (
                <>
                  <HomeEventCard name={home.name} date={schedule.start} />
                  <Box py={0.5}>
                    {events && events.size > 0 ? (
                      <RouteEvent
                        origin={home}
                        dest={events?.docs[0].data()}
                        onChange={handleUpdateDeparture}
                      />
                    ) : dest ? (
                      <RouteEvent
                        origin={home}
                        dest={dest}
                        onChange={handleUpdateDeparture}
                      />
                    ) : (
                      <></>
                    )}
                  </Box>
                </>
              )}
              {events?.docs?.map((event, index) => (
                <Draggable key={event.id} draggableId={event.id} index={index}>
                  {(provided) => (
                    <>
                      <Box
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}>
                        <SpotEvent
                          originRef={event.ref}
                          dest={
                            index !== events.size - 1
                              ? events.docs[index + 1].data()
                              : dest
                          }
                          start={schedule.start}
                        />
                      </Box>
                    </>
                  )}
                </Draggable>
              ))}
              {dest ? (
                <HomeEventCard name={dest.name} date={schedule.start} />
              ) : (
                <Box pt={4}>
                  <AddEventCard
                    text="ホテルを設定する"
                    onClick={() => openMap('selector')}
                  />
                </Box>
              )}
              {provided.placeholder}
            </Box>
          </Stack>
        )}
      </Droppable>
      <DayMenu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        onDelete={handleRemoveDay}
      />
    </>
  )
}

export default DayColumn
