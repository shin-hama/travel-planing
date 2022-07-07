import * as React from 'react'
import { SxProps, Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import {
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from 'react-beautiful-dnd'
import { QueryDocumentSnapshot } from 'firebase/firestore'

import DayHeader from './DayHeader'
import RouteEvent from './Route'
import {
  Route,
  RouteGuidanceAvailable,
  Spot,
} from 'contexts/CurrentPlanProvider'
import DayMenu from './DayMenu'
import { usePlan } from 'hooks/usePlan'
import HomeEventCard from './HomeEventCard'
import AddEventCard from './AddEventCard'
import { usePlanningTab } from 'contexts/PlanningTabProvider'
import { Schedule } from 'hooks/useSchedules'
import { useEvents } from 'hooks/useEvents'
import SpotEvent from './SpotEvent'
import { useFirestore } from 'hooks/firebase/useFirestore'
import dayjs from 'dayjs'

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
): SxProps<Theme> => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background color if dragging
  background: isDragging ? 'lightgreen' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
})

type Props = {
  day: number
  schedule: QueryDocumentSnapshot<Schedule>
  first?: boolean
  last?: boolean
}
const DayColumn: React.FC<Props> = React.memo(function DayColumn({
  day,
  schedule: scheduleQuery,
  first,
  last,
}) {
  const [{ data: plan }] = usePlan()
  const [events] = useEvents(scheduleQuery.ref)

  const schedule = React.useMemo(() => scheduleQuery.data(), [scheduleQuery])
  const db = useFirestore()

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

  const summarizeTotalTime = (targets: Array<Spot>): Date => {
    let _start = dayjs(schedule.start)

    targets.forEach((prev) => {
      // このスポットよりも前にスケジュールされているスポットの滞在時間と移動時間を加算
      _start = _start
        .add(prev.duration, prev.durationUnit)
        .add(prev.next?.time?.value || 0, prev.next?.time?.unit)
    })

    if (schedule.dept) {
      _start = _start.add(
        schedule.dept?.time?.value || 0,
        schedule.dept?.time?.unit
      )
    }
    return _start.toDate()
  }

  const handleUpdate = React.useCallback(
    (updated: Partial<Schedule>) => {
      db.update(scheduleQuery.ref, updated)
    },
    [db, scheduleQuery.ref]
  )

  const handleRemoveDay = () => {
    db.delete(scheduleQuery.ref)
  }

  const handleOpenMenu = (anchor: HTMLElement) => {
    setAnchor(anchor)
  }

  const handleUpdateDeparture = React.useCallback(
    (route: Route) => {
      handleUpdate({ dept: route })
    },
    [handleUpdate]
  )

  if (!schedule) {
    return <>NO Referenced schedule</>
  }

  return (
    <>
      <Droppable
        droppableId={scheduleQuery.id}
        type="ITEM"
        direction="vertical">
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
              onChangeSchedule={handleUpdate}
            />
            <Box>
              {home && (
                <>
                  <HomeEventCard name={home.name} date={schedule.start} />
                  <Box py={0.5}>
                    {events && events.length > 0 ? (
                      <RouteEvent
                        origin={home}
                        dest={events[0].data()}
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
              {events.map((event, index) => (
                <Draggable key={event.id} draggableId={event.id} index={index}>
                  {(provided, snapshot) => (
                    <>
                      <Box
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        sx={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}>
                        <SpotEvent
                          origin={event}
                          dest={
                            index !== events.length - 1
                              ? events[index + 1].data()
                              : dest
                          }
                          start={summarizeTotalTime(
                            events
                              .map((e) => e.data())
                              .filter((e) => e.position < event.data().position)
                          )}
                          handleUpdate={(updated) =>
                            db.update(event.ref, updated)
                          }
                        />
                      </Box>
                    </>
                  )}
                </Draggable>
              ))}
              {dest ? (
                <HomeEventCard
                  name={dest.name}
                  date={summarizeTotalTime(events.map((e) => e.data()))}
                />
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
})

export default DayColumn
