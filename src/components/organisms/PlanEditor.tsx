import * as React from 'react'
import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import FullCalendar, {
  DayHeaderContentArg,
  EventApi,
  EventContentArg,
  EventDropArg,
} from '@fullcalendar/react' // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin, {
  EventResizeDoneArg,
} from '@fullcalendar/interaction'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import SpotEventCard from './SpotEventCard'
import MoveEventCard from './MoveEventCard'
import { useSelectSpots } from 'hooks/useSelectSpots'
import { MoveEvent, SpotEvent } from 'contexts/SelectedPlacesProvider'

dayjs.extend(customParseFormat)

const StyledWrapper = styled('div')<{ width: string }>`
  height: 100%;
  .fc {
    height: 100%;
  }
  .fc-bg-event {
    opacity: 0.6;
    border-radius: ${(props) => props.theme.spacing(1)};
    margin-right: ${(props) => props.theme.spacing(1)};
    margin-left: ${(props) => props.theme.spacing(0.5)};
  }
  .fc-timegrid-event-harness-inset .fc-timegrid-event {
    box-shadow: none;
  }
  // Adjust height to duration of slot row
  .fc-timegrid-slot {
    height: 8em;
    border-bottom: 0;
    vertical-align: top;
  }
  .fc-timegrid-col.fc-day-today {
    background: inherit;
  }

  .fc-view {
    overflow-x: auto;
  }

  .fc-view > table {
    min-width: 100%;
    width: ${(props) => props.width};
  }

  .fc-time-grid .fc-slats {
    z-index: 4;
    pointer-events: none;
  }

  .fc-scroller.fc-time-grid-container {
    overflow: initial !important;
  }

  .fc-axis {
    position: sticky;
    left: 0;
    background: white;
  }

  .fc-scrollgrid {
    border: none !important;
  }

  .fc-scrollgrid td:last-of-type {
    border-right: none !important;
  }

  .fc .fc-timegrid-slot-label-cushion {
    position: relative;
    top: -13.5px;
    background-color: white;
  }
`

const PlanEditor = () => {
  const [events, eventsApi] = useSelectSpots()
  const calendar = React.useRef<FullCalendar>(null)

  const [visibleRange, setVisibleRange] = React.useState<{
    start: Date
    end: Date
  }>({
    start: new Date(),
    end: dayjs().add(1, 'day').toDate(),
  })
  const [daysDuration, setDaysDuration] = React.useState(1)
  const gridWidth = daysDuration * 300

  const handleEventsSet = (_events: EventApi[]) => {
    const days = _events.map((e) => dayjs(e.start))
    const sorted = days.sort((a, b) => a.diff(b))
    console.log(sorted)
    setVisibleRange({
      start: sorted[0].toDate(),
      end: sorted[sorted.length - 1].toDate(),
    })

    setDaysDuration(new Set(days.map((day) => day.date())).size)
  }

  const handleEventDrop = (e: EventDropArg) => {
    eventsApi.update(e.event.toJSON() as SpotEvent)

    if (e.event.end && e.oldEvent.end) {
      events
        .filter(
          (event) =>
            dayjs(event.start).date() === dayjs(e.oldEvent.end).date() &&
            event.id !== e.event.id
        )
        .forEach((event) => {
          eventsApi.update({
            ...event,
            start: dayjs(event.start).add(e.delta.milliseconds, 'ms').toDate(),
            end: dayjs(event.end).add(e.delta.milliseconds, 'ms').toDate(),
          })
        })
    }
  }

  const handleEventResize = (e: EventResizeDoneArg) => {
    eventsApi.update(e.event.toJSON() as SpotEvent)

    if (e.startDelta.milliseconds !== 0) {
      console.log('edit start')
      events
        .filter(
          (event) =>
            dayjs(event.start).date() === dayjs(e.event.start).date() &&
            dayjs(event.start) < dayjs(e.oldEvent.start)
        )
        .forEach((event) => {
          eventsApi.update({
            ...event,
            start: dayjs(event.start)
              .add(e.startDelta.milliseconds, 'ms')
              .toDate(),
            end: dayjs(event.end).add(e.startDelta.milliseconds, 'ms').toDate(),
          })
        })
    } else if (e.endDelta.milliseconds !== 0) {
      console.log('edit end')
      events
        .filter(
          (event) =>
            dayjs(event.start).date() === dayjs(e.event.start).date() &&
            dayjs(event.start) >= dayjs(e.oldEvent.end)
        )
        .forEach((event) => {
          eventsApi.update({
            ...event,
            start: dayjs(event.start)
              .add(e.endDelta.milliseconds, 'ms')
              .toDate(),
            end: dayjs(event.end).add(e.endDelta.milliseconds, 'ms').toDate(),
          })
        })
    }
  }

  const renderEvent = (eventInfo: EventContentArg) => {
    if (eventInfo.event.extendedProps.type === 'spot') {
      return <SpotEventCard event={eventInfo.event} />
    } else if (eventInfo.event.extendedProps.type === 'move') {
      return (
        <MoveEventCard
          event={
            eventInfo.event as EventApi & {
              extendedProps: MoveEvent['extendedProps']
            }
          }
        />
      )
    }
  }

  const renderDayHeader = (props: DayHeaderContentArg) => {
    const yesterday = dayjs()
      .add(-1, 'day')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
    const diff = dayjs(props.date).diff(yesterday, 'day')

    return `Day ${diff}`
  }

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          height: '100%',
        }}>
        <StyledWrapper width={`${gridWidth}px`}>
          <FullCalendar
            ref={calendar}
            plugins={[timeGridPlugin, interactionPlugin]}
            headerToolbar={false}
            initialView="customTimeGridDay"
            views={{
              customTimeGridDay: {
                type: 'timeGrid',
                // duration: { days: daysDuration },
                visibleRange: visibleRange,
              },
            }}
            scrollTime="08:00:00" // Default start time when render the timegrid.
            dayCellClassNames="my-day-cell"
            snapDuration="00:15:00"
            slotDuration="01:00:00"
            slotLabelInterval="01:00:00"
            slotLabelFormat={{
              hour: 'numeric',
              minute: '2-digit',
              hour12: false,
              omitZeroMinute: false,
              meridiem: 'short',
            }}
            // slotMinTime={'05:00:00'}
            // slotMaxTime={'21:00:00'}
            dayHeaders={true}
            dayHeaderContent={renderDayHeader}
            allDaySlot={false}
            editable={true}
            selectable={true}
            selectMirror={true}
            droppable={true}
            dayMaxEvents={true}
            weekends={true}
            longPressDelay={500}
            eventMinHeight={5}
            nowIndicator={false}
            events={events}
            eventResizableFromStart
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            eventContent={renderEvent} // custom render function
            eventsSet={handleEventsSet} // called after events are initialized/added/changed/removed
          />
        </StyledWrapper>
      </Box>
    </>
  )
}

export default PlanEditor
