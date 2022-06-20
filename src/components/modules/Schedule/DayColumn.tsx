import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import { QueryDocumentSnapshot } from 'firebase/firestore'

import DayHeader from './DayHeader'
import RouteEvent from './Route'
import { Route, RouteGuidanceAvailable } from 'contexts/CurrentPlanProvider'
import DayMenu from './DayMenu'
import { usePlan } from 'hooks/usePlan'
import HomeEventCard from './HomeEventCard'
import AddEventCard from './AddEventCard'
import { usePlanningTab } from 'contexts/PlanningTabProvider'
import { Schedule } from 'hooks/useSchedules'
import { useEvents } from 'hooks/useEvents'
import SpotEvent from './SpotEvent'
import { useFirestore } from 'hooks/firebase/useFirestore'
import { useMove } from 'hooks/useMove'

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
  const [plan] = usePlan()
  const [events] = useEvents(scheduleQuery.ref)
  console.log(events)
  const schedule = React.useMemo(() => scheduleQuery.data(), [scheduleQuery])
  const { updatePosition } = useMove()
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

  const handleDropEnd = (result: DropResult) => {
    if (!result.destination || !events) {
      return
    }

    const source = result.source
    const destination = result.destination

    console.log(result)

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    if (result.type === 'ITEM') {
      if (source.droppableId === destination.droppableId) {
        // moving to same list
        const items = events.map((doc) => doc.data())
        const reordered = updatePosition(items, source.index, destination.index)

        db.update(events[source.index].ref, reordered)
      } else {
        // moving to another day
        const [removedSpot] = events.splice(source.index, 1)
      }
    }
  }

  if (!schedule) {
    return <>NO Referenced schedule</>
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDropEnd}>
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
                  <Draggable
                    key={event.id}
                    draggableId={event.id}
                    index={index}>
                    {(provided) => (
                      <>
                        <Box
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}>
                          <SpotEvent
                            origin={event.data()}
                            dest={
                              index !== events.length - 1
                                ? events[index + 1].data()
                                : dest
                            }
                            start={schedule.start}
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
      </DragDropContext>
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
