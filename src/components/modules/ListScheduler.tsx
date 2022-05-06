import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd'

import SpotCard from './SpotCard'
import DayMenu from './DayMenu'
import { useList } from 'react-use'
import { useTravelPlan } from 'hooks/useTravelPlan'

const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
const ListScheduler: React.FC = () => {
  const [plan, planApi] = useTravelPlan()
  const [days, setDays] = useList([1])
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)

  const handleAddDay = () => {
    if (!plan) {
      alert('plan is not selected')
      return
    }
    setDays.push(days.length + 1)
    planApi.update({
      events: [
        ...plan.events,
        {
          spots: [],
        },
      ],
    })
  }

  const handleRemoveDay = () => {
    planApi.update({
      events: plan?.events.filter((_, i) => i !== plan.events.length - 1),
    })
  }

  const handleOpenMenu = (anchor: HTMLElement) => {
    setAnchor(anchor)
  }

  const handleDragEnd = (result: DropResult) => {
    console.log(result)
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
        console.log(plan.events[Number.parseInt(source.droppableId)].spots)
        // moving to same list
        const reordered = reorder(
          plan.events[Number.parseInt(source.droppableId)].spots,
          source.index,
          destination.index
        )
        console.log(reordered)

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
        planApi.update({ events: plan.events })
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
                            ref={provided.innerRef}
                            {...provided.droppableProps}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between">
                              <Typography>Day {i}</Typography>
                              <Box>
                                <IconButton onClick={handleRemoveDay}>
                                  <SvgIcon>
                                    <FontAwesomeIcon icon={faPlus} />
                                  </SvgIcon>
                                </IconButton>
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
                                    <SpotCard spot={spot} />
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
    </>
  )
}

export default ListScheduler
