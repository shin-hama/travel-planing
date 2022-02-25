import * as React from 'react'
import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import FullCalendar, {
  DayHeaderContentArg,
  EventApi,
  EventChangeArg,
  EventContentArg,
} from '@fullcalendar/react' // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { useDistanceMatrix } from 'hooks/useDistanceMatrix'
import SpotEventCard from './SpotEventCard'
import MoveEventCard from './MoveEventCard'
import { useSelectSpots } from 'hooks/useSelectSpots'
import { SpotEvent } from 'contexts/SelectedPlacesProvider'

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

  const distanceMatrix = useDistanceMatrix()
  // to avoid the bug that infinite rerender and recall api after every api call
  const distCountRef = React.useRef(0)

  const [daysDuration, setDaysDuration] = React.useState(1)
  const gridWidth = daysDuration * 300

  React.useEffect(() => {
    // Need to call before distance matrix api
    // APIよりあとにこれを実行すると、APIが二回実行されてしまうので注意
    // Reset count to make to be callable
    distCountRef.current = 0
  }, [])

  React.useEffect(() => {
    if (distCountRef.current !== 0) {
      return
    }
    distCountRef.current += 1

    // マトリックスの要素数で課金されるので、できるだけ少なくなるようにリクエストを考える
    // 例: 3地点の距離を計算するとき、3*3でリクエストすると9回分だが、
    // 1,2点目 + 2,3 点目というようにすれば 2 回分ですむ
  }, [distanceMatrix])

  const handleEventsSet = (_events: EventApi[]) => {
    if (_events.length > 0) {
      const first = _events[0].start?.getDate() || 0
      const last = _events[_events.length - 1].start?.getDate() || 0
      setDaysDuration(last - first + 1)
    }
  }

  const handleEventChanged = (e: EventChangeArg) => {
    eventsApi.update(e.event.toJSON() as SpotEvent)

    if (e.event.end && e.oldEvent.end) {
      const endDiff = dayjs(e.event.end).diff(e.oldEvent.end, 'minute')

      Object.values(events)
        .filter(
          (event) =>
            e.oldEvent.end &&
            dayjs(event.start).date() === dayjs(e.oldEvent.end).date()
        )
        .forEach((event) => {
          eventsApi.update({
            ...event,
            start: dayjs(event.start).add(endDiff, 'minute').toDate(),
            end: dayjs(event.end).add(endDiff, 'minute').toDate(),
          })
        })
      console.log(events)
    }
  }

  const renderEvent = (eventInfo: EventContentArg) => {
    if (eventInfo.event.extendedProps.placeId) {
      return <SpotEventCard event={eventInfo.event} />
    }

    return <MoveEventCard event={eventInfo.event} />
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
    <Box
      sx={{
        flexGrow: 1,
        height: '100%',
      }}>
      <StyledWrapper width={`${gridWidth}px`}>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          headerToolbar={false}
          initialView="customTimeGridDay"
          views={{
            customTimeGridDay: {
              type: 'timeGrid',
              duration: { days: daysDuration },
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
          slotMinTime={'05:00:00'}
          slotMaxTime={'21:00:00'}
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
          events={Object.values(events)}
          eventChange={handleEventChanged}
          eventContent={renderEvent} // custom render function
          eventsSet={handleEventsSet} // called after events are initialized/added/changed/removed
        />
      </StyledWrapper>
    </Box>
  )
}

export default PlanEditor
