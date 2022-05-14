import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import DayHeader from './DayHeader'
import Route from './Route'
import SpotEventCard from './SpotEventCard'
import { Schedule } from 'contexts/CurrentPlanProvider'
import DayMenu from './DayMenu'
import { useTravelPlan } from 'hooks/useTravelPlan'

type Props = {
  day: number
  schedule: Schedule
}
const DayColumn: React.FC<Props> = ({ day, schedule }) => {
  const [plan, planApi] = useTravelPlan()
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)

  const handleRemoveDay = () => {
    planApi.update({
      events: plan?.events.filter((_, i) => i !== plan.events.length - 1),
    })
  }

  const handleOpenMenu = (anchor: HTMLElement) => {
    setAnchor(anchor)
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
            <DayHeader day={day + 1} onOpenMenu={handleOpenMenu} />
            <Box>
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
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Draggable>
              ))}
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
