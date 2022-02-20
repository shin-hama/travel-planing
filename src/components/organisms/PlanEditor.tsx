import * as React from 'react'
import Box from '@mui/material/Box'
import FullCalendar, { EventInput } from '@fullcalendar/react' // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'

let eventGuid = 0

type EVENT = {
  name: string
  time: string
  kind: string
}
const EVENTS: EVENT[] = [
  { name: 'spot1', time: '00:60:00', kind: 'spot' },
  { name: 'Train', time: '00:30:00', kind: 'move' },
  { name: 'spot2', time: '00:45:00', kind: 'spot' },
  { name: 'walk', time: '00:10:00', kind: 'move' },
  { name: 'spot3', time: '00:20:00', kind: 'spot' },
]

function createEventId() {
  return String(eventGuid++)
}

const createEvent = (e: {
  title: string
  start: Date
  end: Date
  color: string
}): EventInput => {
  return {
    id: createEventId(),
    ...e,
  }
}

const createEvents = () => {
  const start = moment('09:00:00', 'HH:mm:ss')

  const events = EVENTS.map(event => {
    const startClone = start.clone()
    start.add(event.time)
    const newEvent = createEvent({
      title: event.name,
      start: startClone.toDate(),
      end: start.toDate(),
      color: event.kind === 'spot' ? 'cornflowerblue' : 'lightgreen',
    })
    return newEvent
  })
  console.log(events)
  return events
}

const PlanEditor = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100vh',
      }}>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay',
        }}
        initialView="timeGridDay"
        editable={false}
        selectable={true}
        selectMirror={true}
        droppable={true}
        dayMaxEvents={true}
        weekends={true}
        eventMinHeight={5}
        initialEvents={createEvents()} // alternatively, use the `events` setting to fetch from a feed
        // select={handleDateSelect}
        // eventContent={renderEventContent} // custom render function
        // eventClick={handleEventClick}
        // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
        /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
      />
    </Box>
  )
}

export default PlanEditor
