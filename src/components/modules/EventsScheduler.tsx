/** @jsxImportSource @emotion/react */
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
import { usePlanEvents, MoveEvent, SpotEvent } from 'hooks/usePlanEvents'
import { useScheduleEvents } from 'hooks/useScheduleEvents'
import { TravelPlan } from 'hooks/useTravelPlan'

dayjs.extend(customParseFormat)

const MIN_COLUMN_WIDTH = 260

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
    border-bottom: 0;
    vertical-align: top;
  }
  .fc-timegrid-slot-minor {
    border: none;
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

type Props = {
  plan: TravelPlan
}
const EventsScheduler: React.FC<Props> = React.memo(function EventsScheduler({
  plan,
}) {
  const calendar = React.useRef<FullCalendar>(null)
  const [, eventsApi] = usePlanEvents()
  const events = useScheduleEvents(plan)

  console.log('test')

  React.useEffect(() => {
    console.log('editor plan')
  }, [plan])

  React.useEffect(() => {
    console.log('editor events')
  }, [events])
  const [visibleRange, setVisibleRange] = React.useState<{
    start: Date
    end: Date
  }>({
    start: new Date(),
    end: new Date(),
  })
  /**
   * The minimum column width of the time grid
   */
  const [gridWidth, setGridWidth] = React.useState(MIN_COLUMN_WIDTH)

  const handleEventsSet = (_events: EventApi[]) => {
    if (_events.length === 0) {
      return
    }

    const days = _events.map((e) => dayjs(e.start))
    const sorted = days.sort((a, b) => a.diff(b))
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    // Not update visibleRange if range is not changed
    if (
      first.date() !== visibleRange.start.getDate() ||
      last.date() !== visibleRange.end.getDate()
    ) {
      setVisibleRange({
        start: first.toDate(),
        end: last.toDate(),
      })

      setGridWidth(MIN_COLUMN_WIDTH * (last.date() - first.date() + 1))
    }
  }

  const handleEventDrop = async (e: EventDropArg) => {
    // 画面上で元の位置に戻らないようとりあえず Event を更新する
    const droppedEvent = eventsApi.get<SpotEvent>(
      e.event.id,
      e.event.extendedProps.type
    )
    if (!droppedEvent) {
      throw new Error('Cannot find dropped event')
    }
    const cloned: SpotEvent = {
      ...droppedEvent,
      start: dayjs(e.event.start).toDate(),
      end: dayjs(e.event.end).toDate(),
    }

    console.log(cloned)

    if (e.event.end && e.oldEvent.end) {
      if (Math.abs(e.event.end.getDate() - e.oldEvent.end.getDate()) >= 1) {
        console.log('Move day')
        eventsApi.remove(droppedEvent)

        // Move to target day
        eventsApi.insert(cloned)
      } else {
        // 同じ日付内で移動した場合は、全てのイベントの開始時刻を同じだけずらす
        eventsApi.followMoving(cloned, e.delta.milliseconds, 'ms')
      }
      eventsApi.commit()
    }
  }

  const handleEventResize = (e: EventResizeDoneArg) => {
    const resizedEvent = eventsApi.get<SpotEvent>(
      e.event.id,
      e.event.extendedProps.type
    )
    if (!resizedEvent) {
      throw new Error('Cannot find resized event')
    }
    eventsApi.update({
      ...resizedEvent,
      start: dayjs(e.event.start).toDate(),
      end: dayjs(e.event.end).toDate(),
    })

    if (e.startDelta.milliseconds !== 0) {
      console.log('edit start time')
      // 対象より前のイベントすべての時間を早める
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
      console.log('edit end time')
      // 対象より後のイベントすべての時間を遅らせる
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

    eventsApi.commit()
  }

  const renderEvent = (eventInfo: EventContentArg) => {
    if (eventInfo.event.extendedProps.type === 'spot') {
      const event = eventsApi.get<SpotEvent>(eventInfo.event.id, 'spot')
      if (!event) {
        return
      }
      return <SpotEventCard event={event} />
    } else if (eventInfo.event.extendedProps.type === 'move') {
      const event = eventsApi.get<MoveEvent>(eventInfo.event.id, 'move')
      if (!event) {
        return
      }

      return <MoveEventCard event={event} />
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
            slotDuration="00:10:00"
            snapDuration="00:15:00"
            forceEventDuration={true}
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
            selectMinDistance={10} // will not fire select not to drag mouse
            // selectMirror={true}
            droppable={true}
            dayMaxEvents={true}
            weekends={true}
            longPressDelay={500}
            nowIndicator={false}
            eventMinHeight={5}
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
})

export default EventsScheduler
