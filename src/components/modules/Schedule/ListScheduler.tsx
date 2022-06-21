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
import { useFirestore } from 'hooks/firebase/useFirestore'
import { useMove } from 'hooks/useMove'
import { useEvents } from 'hooks/useEvents'
import { Spot } from 'contexts/CurrentPlanProvider'
import { doc } from 'firebase/firestore'

const ListScheduler: React.FC = () => {
  const [schedules] = useSchedules()
  const db = useFirestore()
  const { updatePosition } = useMove()
  const [events, eventsApi] = useEvents()

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
      const items = schedules.docs.map((doc) => doc.data())
      const newSchedule = updatePosition(items, source.index, destination.index)

      db.update(schedules.docs[source.index].ref, newSchedule)
    } else if (result.type === 'ITEM') {
      // reordering Event items
      let reordered: Spot | null = null
      if (source.droppableId === destination.droppableId) {
        // moving to same list
        const schedule = schedules.docs.find(
          (doc) => doc.id === source.droppableId
        )
        if (!schedule) {
          console.error('Moved source object is not found')
          return
        }
        const items = eventsApi.filter(schedule.ref).map((doc) => doc.data())
        reordered = updatePosition(items, source.index, destination.index)
      } else {
        // moving to another day
        const movedSpot = events[source.index].data()

        // droppableId は Schedule ドキュメントの ID が設定されている
        const dest = doc(movedSpot.schedule.parent, destination.droppableId)
        movedSpot.schedule = dest
        const destEvents = eventsApi.filter(dest).map((e) => e.data())

        reordered = updatePosition(
          [movedSpot, ...destEvents],
          0,
          destination.index
        )
        console.log(reordered)
      }
      if (reordered) {
        db.update(events[source.index].ref, reordered)
      }
      if (destination.droppableId === 'newDay') {
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
