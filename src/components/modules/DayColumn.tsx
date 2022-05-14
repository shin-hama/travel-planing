import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import DayHeader from './DayHeader'
import Route from './Route'
import SpotEventCard from './SpotEventCard'
import {
  NextMove,
  RouteGuidanceAvailable,
  Schedule,
} from 'contexts/CurrentPlanProvider'
import DayMenu from './DayMenu'
import { useTravelPlan } from 'hooks/useTravelPlan'
import HomeEventCard from './HomeEventCard'
import { useWaypoints } from 'hooks/useWaypoints'

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
      }
    }

    return null
  }, [last, plan, schedule.dept])

  const handleRemoveDay = () => {
    planApi.update({
      events: plan?.events.filter((_, i) => i !== plan.events.length - 1),
    })
  }

  const handleOpenMenu = (anchor: HTMLElement) => {
    setAnchor(anchor)
  }

  const handleUpdateHome = React.useCallback(
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
    [plan, schedule]
  )

  const handleUpdateWaypointNext = React.useCallback(
    (next: NextMove, id: string) => {
      waypointsApi.update(id, { next })
    },
    []
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
                    <Route
                      origin={home}
                      dest={schedule.spots[0]}
                      onChange={handleUpdateHome}
                    />
                  </Box>
                </>
              )}
              {schedule.spots.map((spot, index) => (
                <Draggable key={spot.id} draggableId={spot.id} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}>
                      <SpotEventCard
                        spot={spot}
                        prevSpots={schedule.spots.slice(0, index)}
                        dayStart={schedule.start}
                      />
                      {index !== schedule.spots.length - 1 && (
                        <Box py={0.5}>
                          <Route
                            origin={spot}
                            dest={schedule.spots[index + 1]}
                            onChange={handleUpdateWaypointNext}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Draggable>
              ))}
              {dest && (
                <>
                  <Box py={0.5}>
                    <Route
                      origin={schedule.spots.slice(-1)[0]}
                      dest={dest}
                      onChange={handleUpdateWaypointNext}
                    />
                  </Box>
                  <HomeEventCard name={dest.name} date={schedule.end} />
                </>
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
