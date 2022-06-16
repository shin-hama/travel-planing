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
import { usePlan } from 'hooks/usePlan'
import { useSchedules } from 'hooks/useSchedules'
import { useFirestore } from 'hooks/firebase/useFirestore'

type OrderedItem = {
  position: number
}

const movePosition = <T extends OrderedItem>(
  items: T[],
  startIndex: number,
  destIndex: number
): T => {
  const cloned = Array.from(items)
  const [target] = cloned.splice(startIndex, 1)

  const prevPos = cloned[destIndex - 1]?.position || 0
  const nextPos =
    cloned[destIndex]?.position || cloned[cloned.length - 1].position * 2

  target.position = (prevPos + nextPos) / 2

  return target
}

const ListScheduler: React.FC = () => {
  const [plan, planApi] = usePlan()
  const [schedules] = useSchedules()
  const db = useFirestore()

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
      if (schedules) {
        const items = schedules.docs.map((doc) => doc.data())
        const newSchedule = movePosition(items, source.index, destination.index)

        console.log(newSchedule)

        db.update(schedules.docs[source.index].ref, newSchedule)
      }
    } else if (result.type === 'ITEM') {
      if (source.droppableId === destination.droppableId) {
        // moving to same list
        const reordered = movePosition(
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
              {schedules?.docs.map((schedule, i) => (
                <Draggable key={`day-${i}`} draggableId={`day-${i}`} index={i}>
                  {(provided: DraggableProvided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}>
                      <DayColumn
                        day={i}
                        schedule={schedule.ref}
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
