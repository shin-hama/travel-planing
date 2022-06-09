import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import DayHeader from './DayHeader'
import RouteEvent from './Route'
import SpotEventCard from './SpotEventCard'
import {
  NextMove,
  RouteGuidanceAvailable,
  Schedule,
  Spot,
} from 'contexts/CurrentPlanProvider'
import DayMenu from './DayMenu'
import { useTravelPlan } from 'hooks/useTravelPlan'
import HomeEventCard from './HomeEventCard'
import { useWaypoints } from 'hooks/useWaypoints'
import { useRoutes } from 'hooks/useRoutes'
import dayjs from 'dayjs'
import AddEventCard from './AddEventCard'
import { usePlanningTab } from 'contexts/PlanningTabProvider'

type Props = {
  day: number
  schedule: Schedule
  first?: boolean
  last?: boolean
}
const DayColumn: React.FC<Props> = ({ day, schedule, first, last }) => {
  const [plan, planApi] = useTravelPlan()
  const [, waypointsApi] = useWaypoints()
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)
  const [, { openMap }] = usePlanningTab()

  const home = React.useMemo<RouteGuidanceAvailable | null>(() => {
    if (plan) {
      if (first) {
        return { ...plan.home, next: schedule.dept }
      } else if (plan.lodging) {
        return { ...plan.lodging, next: schedule.dept }
      }
    }

    return null
  }, [first, plan, schedule.dept])

  const dest = React.useMemo<RouteGuidanceAvailable | null>(() => {
    if (plan) {
      if (last) {
        return { ...plan.home, next: schedule.dept }
      } else if (plan.lodging) {
        return { ...plan.lodging, next: schedule.dept }
      } else {
        return null
      }
    }

    return null
  }, [last, plan, schedule.dept])

  const { routesApi } = useRoutes()

  const summarizeTotalTime = (prevSpots: Array<Spot>): Date => {
    let _start = dayjs(schedule.start)
    prevSpots.forEach((prev) => {
      // このスポットよりも前にスケジュールされているスポットの滞在時間と移動時間を加算
      const nextRoute =
        prev.next &&
        routesApi.get({
          from: prev.id,
          to: prev.next.id,
          mode: prev.next.mode,
        })
      _start = _start
        .add(prev.duration, prev.durationUnit)
        .add(nextRoute?.time?.value || 0, nextRoute?.time?.unit)
    })

    if (home && schedule.dept) {
      const deptRoute = routesApi.get({
        from: home.id,
        to: schedule.dept.id,
        mode: schedule.dept.mode,
      })
      _start = _start.add(deptRoute?.time?.value || 0, deptRoute?.time?.unit)
    }
    return _start.toDate()
  }

  const handleRemoveDay = () => {
    planApi.update({
      events: plan?.events.filter((_, i) => i !== plan.events.length - 1),
    })
  }

  const handleOpenMenu = (anchor: HTMLElement) => {
    setAnchor(anchor)
  }

  const handleUpdateDeparture = React.useCallback(
    (next: NextMove) => {
      if (plan) {
        planApi.update({
          events: plan.events.map((event) =>
            event.start === schedule.start
              ? {
                  ...schedule,
                  dept: next,
                }
              : event
          ),
        })
      }
    },
    [plan, planApi, schedule]
  )

  const handleUpdateWaypointNext = React.useCallback(
    (next: NextMove, id: string) => {
      waypointsApi.update(id, { next })
    },
    [waypointsApi]
  )

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
            <DayHeader day={day + 1} onOpenMenu={handleOpenMenu} />
            <Box>
              {home && (
                <>
                  <HomeEventCard name={home.name} date={schedule.start} />
                  <Box py={0.5}>
                    {schedule.spots.length > 0 ? (
                      <RouteEvent
                        origin={home}
                        dest={schedule.spots[0]}
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
              {schedule.spots.map((spot, index) => (
                <Draggable key={spot.id} draggableId={spot.id} index={index}>
                  {(provided) => (
                    <>
                      <Box
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}>
                        <SpotEventCard
                          spot={spot}
                          start={summarizeTotalTime(
                            schedule.spots.slice(0, index)
                          )}
                        />
                      </Box>
                      {index !== schedule.spots.length - 1 && (
                        <Box py={0.5}>
                          <RouteEvent
                            origin={spot}
                            dest={schedule.spots[index + 1]}
                            onChange={handleUpdateWaypointNext}
                          />
                        </Box>
                      )}
                    </>
                  )}
                </Draggable>
              ))}
              {dest ? (
                <>
                  {schedule.spots.length > 0 && (
                    <Box py={0.5}>
                      <RouteEvent
                        origin={schedule.spots.slice(-1)[0]}
                        dest={dest}
                        onChange={handleUpdateWaypointNext}
                      />
                    </Box>
                  )}
                  <HomeEventCard
                    name={dest.name}
                    date={summarizeTotalTime(schedule.spots)}
                  />
                </>
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
