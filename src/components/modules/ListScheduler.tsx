import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd'

import DayMenu from './DayMenu'
import { useTravelPlan } from 'hooks/useTravelPlan'
import SpotEventCard from './SpotEventCard'
import SpotEventEditor from './SpotEventEditor'
import { Spot } from 'contexts/CurrentPlanProvider'
import Route from './Route'

const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
const ListScheduler: React.FC = () => {
  const [plan, planApi] = useTravelPlan()
  const [editSpot, setEditSpot] = React.useState<Spot | null>(null)
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)

  const handleRemoveDay = () => {
    planApi.update({
      events: plan?.events.filter((_, i) => i !== plan.events.length - 1),
    })
  }

  const handleOpenMenu = (anchor: HTMLElement) => {
    setAnchor(anchor)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !plan) {
      return
    }

    const source = result.source
    const destination = result.destination

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    // reordering column
    if (result.type === 'COLUMN') {
      const newEvents = reorder(plan.events, source.index, destination.index)

      planApi.update({ events: newEvents })
    } else if (result.type === 'ITEM') {
      if (source.droppableId === destination.droppableId) {
        // moving to same list
        const reordered = reorder(
          plan.events[Number.parseInt(source.droppableId)].spots,
          source.index,
          destination.index
        )

        planApi.update({
          events: plan.events.map((event, i) =>
            i.toString() === source.droppableId
              ? {
                  ...event,
                  spots: reordered,
                }
              : event
          ),
        })
      } else if (destination.droppableId === 'newDay') {
        const [removedSpot] = plan.events[
          Number.parseInt(source.droppableId)
        ].spots.splice(source.index, 1)
        planApi.update({
          events: [
            ...plan.events,
            {
              spots: [removedSpot],
            },
          ],
        })
      } else {
        // moving to different list
        const [removedSpot] = plan.events[
          Number.parseInt(source.droppableId)
        ].spots.splice(source.index, 1)

        plan.events[Number.parseInt(destination.droppableId)].spots.splice(
          destination.index,
          0,
          removedSpot
        )
        planApi.update({
          events: plan.events,
        })
      }
    } else {
      throw Error('not supported: ' + result.type)
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided: DroppableProvided) => (
            <Stack
              ref={provided.innerRef}
              {...provided.droppableProps}
              direction="row"
              spacing={4}
              sx={{
                height: '100%',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}>
              {plan?.events.map((event, i) => (
                <Draggable key={`day-${i}`} draggableId={`day-${i}`} index={i}>
                  {(provided: DraggableProvided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}>
                      <Droppable
                        droppableId={i.toString()}
                        type="ITEM"
                        direction="vertical">
                        {(provided) => (
                          <Stack
                            spacing={2}
                            minWidth="320px"
                            height="100%"
                            ref={provided.innerRef}
                            {...provided.droppableProps}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between">
                              <Typography>Day {i + 1}</Typography>
                              <Box>
                                <IconButton
                                  onClick={(e) =>
                                    handleOpenMenu(e.currentTarget)
                                  }>
                                  <SvgIcon>
                                    <FontAwesomeIcon
                                      icon={faEllipsisVertical}
                                    />
                                  </SvgIcon>
                                </IconButton>
                              </Box>
                            </Stack>
                            {event.spots.map((spot, index) => (
                              <Draggable
                                key={spot.id}
                                draggableId={spot.id}
                                index={index}>
                                {(provided) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}>
                                    <Box onClick={() => setEditSpot(spot)}>
                                      <SpotEventCard spot={spot} />
                                    </Box>
                                    {index !== event.spots.length - 1 && (
                                      <Route
                                        origin={spot}
                                        dest={event.spots[index + 1]}
                                      />
                                    )}
                                  </Box>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </Stack>
                        )}
                      </Droppable>
                    </Box>
                  )}
                </Draggable>
              ))}
              <Droppable droppableId="newDay" type="ITEM">
                {(provided) => (
                  <Stack
                    spacing={2}
                    minWidth="320px"
                    justifyContent="center"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      border: (theme) =>
                        `dashed 1px ${theme.palette.grey[400]}`,
                      color: (theme) => theme.palette.grey[400],
                    }}>
                    <Typography textAlign="center">+ Add New Day</Typography>
                  </Stack>
                )}
              </Droppable>
              {provided.placeholder}
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
      {editSpot && (
        <SpotEventEditor
          spotId={editSpot.id}
          open={Boolean(editSpot)}
          onClose={() => setEditSpot(null)}
        />
      )}
    </>
  )
}

export default ListScheduler
