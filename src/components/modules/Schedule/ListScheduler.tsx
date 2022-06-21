import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd'

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
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ListScheduler
