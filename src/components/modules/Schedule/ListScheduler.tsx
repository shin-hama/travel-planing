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

import DayColumn from './DayColumn'
import { useSchedules } from 'hooks/useSchedules'
import { useMove } from 'hooks/useMove'

const ListScheduler: React.FC = () => {
  const [schedules] = useSchedules()
  const move = useMove()

  const handleDragEnd = (result: DropResult) => {
    console.log('DragEnd')
    if (!result.destination || !schedules) {
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

    console.log(result)
    if (result.type === 'COLUMN') {
      // reordering day columns
      move.reorderSchedule(source.index, destination.index)
    } else if (result.type === 'ITEM') {
      // reordering Event items
      if (source.droppableId === destination.droppableId) {
        move.reorderEvent(source.index, source.droppableId, destination.index)
      } else if (destination.droppableId === 'newDay') {
        console.error('Not Implemented')
        // Add a new day
        // const newDate = dayjs(schedules.docs.slice(-1)[0].data().start)
        //   .add(1, 'day')
        //   .hour(9)
        //   .minute(0)
        // schedulesApi.create({
        //   start: newDate.toDate(),
        //   end: newDate.hour(19).toDate(),
        // })
      } else {
        move.moveEvent(
          source.index,
          source.droppableId,
          destination.index,
          destination.droppableId
        )
      }
    } else {
      throw Error('not supported: ' + result.type)
    }
  }

  return (
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
            {schedules?.docs.map((schedule, i) => (
              <Draggable key={`day-${i}`} draggableId={`day-${i}`} index={i}>
                {(provided: DraggableProvided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}>
                    <DayColumn
                      day={i}
                      schedule={schedule}
                      first={i === 0}
                      last={i === schedules.size - 1}
                    />
                  </Box>
                )}
              </Draggable>
            ))}
            <Droppable droppableId="newDay" type="ITEM">
              {(provided) => (
                <Stack
                  minWidth="320px"
                  justifyContent="center"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    border: (theme) => `dashed 1px ${theme.palette.grey[400]}`,
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
  )
}

export default ListScheduler
