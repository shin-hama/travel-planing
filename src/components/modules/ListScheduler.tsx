import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd'
import dayjs from 'dayjs'

import { useTravelPlan } from 'hooks/useTravelPlan'
import DayColumn from './DayColumn'

const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
const ListScheduler: React.FC = () => {
  const [plan, planApi] = useTravelPlan()

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
        // Add a new day
        const [removedSpot] = plan.events[
          Number.parseInt(source.droppableId)
        ].spots.splice(source.index, 1)

        const newDate = dayjs(plan.events.slice(-1)[0].start)
          .add(1, 'day')
          .hour(9)
          .minute(0)
        planApi.update({
          events: [
            ...plan.events,
            {
              start: newDate.toDate(),
              end: newDate.hour(19).toDate(),
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
              {plan?.events.map(
                (event, i) =>
                  event.spots.length > 0 && (
                    <Draggable
                      key={`day-${i}`}
                      draggableId={`day-${i}`}
                      index={i}>
                      {(provided: DraggableProvided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}>
                          <DayColumn
                            day={i}
                            schedule={event}
                            first={i === 0}
                            last={i === plan.events.length - 1}
                          />
                        </Box>
                      )}
                    </Draggable>
                  )
              )}
              <Droppable droppableId="newDay" type="ITEM">
                {(provided) => (
                  <Stack
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
    </>
  )
}

export default ListScheduler
