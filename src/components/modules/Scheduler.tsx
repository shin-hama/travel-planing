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
import { Plan, MoveEvent, SpotEvent } from 'contexts/CurrentPlanProvider'
import { useScheduleEvents } from 'hooks/useScheduleEvents'
import { useWaypoints } from 'hooks/useWaypoints'
import { PlanAPI } from 'hooks/useTravelPlan'

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

// useTravelPlan() が何度も再読み込みされるのを防ぐために props で受け取る
type Props = {
  plan: Plan
  planApi: PlanAPI
}
const Scheduler: React.FC<Props> = ({ plan, planApi }) => {
  const calendar = React.useRef<FullCalendar>(null)
  const [events, eventsApi] = useScheduleEvents()
  const [waypoints, waypointsApi] = useWaypoints()

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

    if (e.event.end && e.oldEvent.end) {
      if (Math.abs(e.event.end.getDate() - e.oldEvent.end.getDate()) >= 1) {
        if (!waypoints) {
          return
        }

        console.log('Move day')
        const prevSpots = events
          ?.filter(
            (event): event is SpotEvent =>
              event.extendedProps.type === 'spot' &&
              // 移動したイベントよりも前のイベントでフィルター
              dayjs(e.event.start).diff(event.start) > 0
          )
          .sort((a, b) => dayjs(b.start).diff(a.start)) // 開始日の降順に並び替え

        const prevIndex = waypoints?.findIndex(
          (spot) => spot.id === prevSpots[0].id
        )

        waypointsApi.move(
          droppedEvent.id,
          prevIndex !== -1 ? prevIndex : 0 // 移動した先にイベントがない場合は、最初に挿入する
        )
      } else {
        // 同じ日付内で移動した場合は、全てのイベントの開始時刻を同じだけずらす
        console.log('move all')

        planApi.update({
          startTime: dayjs(plan.startTime)
            .add(e.delta.milliseconds, 'millisecond')
            .toDate(),
        })
      }
    }
  }

  const handleEventResize = async (e: EventResizeDoneArg) => {
    const resizedEvent = eventsApi.get<SpotEvent>(
      e.event.id,
      e.event.extendedProps.type
    )
    if (!resizedEvent) {
      throw new Error('Cannot find resized event')
    }

    planApi.update({
      startTime: dayjs(plan.startTime)
        .add(e.startDelta.milliseconds, 'millisecond')
        .toDate(),
    })

    waypointsApi.update(resizedEvent.id, {
      duration: dayjs(e.event.end).diff(e.event.start, 'minute'),
      durationUnit: 'minute',
    })
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
    return dayjs(props.date).format('MM/DD (ddd)')
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
}

export default Scheduler
