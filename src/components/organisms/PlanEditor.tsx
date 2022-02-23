import * as React from 'react'
import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import FullCalendar, {
  DayHeaderContentArg,
  EventApi,
  EventContentArg,
  EventInput,
} from '@fullcalendar/react' // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'
import { useList } from 'react-use'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { SelectedPlacesContext } from 'contexts/SelectedPlacesProvider'
import { useDistanceMatrix } from 'hooks/useDistanceMatrix'
import { useGetSpotByPkLazyQuery } from 'generated/graphql'
import SpotEventCard from './SpotEventCard'
import MoveEventCard from './MoveEventCard'

dayjs.extend(customParseFormat)

const StyledWrapper = styled('div')<{ width: string }>`
  height: 100%;
  .fc {
    height: 100%;
  }
  // Adjust height to duration of slot row
  .fc-timegrid-slot {
    height: 8em;
    border-bottom: 0;
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
`
let eventGuid = 0

function createEventId() {
  return String(eventGuid++)
}

const createEvent = (e: {
  title: string
  start: Date
  end: Date
  color: string
  placeId?: string
  imageUrl?: string
}): EventInput => {
  return {
    id: createEventId(),
    ...e,
  }
}

const PlanEditor = () => {
  const places = React.useContext(SelectedPlacesContext)

  const [getSpot] = useGetSpotByPkLazyQuery()
  const distanceMatrix = useDistanceMatrix()
  // to avoid the bug that infinite rerender and recall api after every api call
  const distCountRef = React.useRef(0)

  const [daysDuration, setDaysDuration] = React.useState(1)
  const gridWidth = daysDuration * 300

  const [events, setEvents] = useList<EventInput>([])

  React.useEffect(() => {
    // Need to call before distance matrix api
    // APIよりあとにこれを実行すると、APIが二回実行されてしまうので注意
    // Reset count to make to be callable
    distCountRef.current = 0
    return () => {
      setEvents.clear()
    }
  }, [setEvents])

  React.useEffect(() => {
    if (distCountRef.current !== 0) {
      return
    }
    distCountRef.current += 1

    // マトリックスの要素数で課金されるので、できるだけ少なくなるようにリクエストを考える
    // 例: 3地点の距離を計算するとき、3*3でリクエストすると9回分だが、
    // 1,2点目 + 2,3 点目というようにすれば 2 回分ですむ
    const func = async () => {
      let start = dayjs('09:00:00', 'HH:mm:ss')

      for (const [i, place] of places.entries()) {
        const spot = await getSpot({
          variables: { place_id: place.placeId },
        })

        const spotEnd = start.add(1, 'hour')
        const spotEvent = createEvent({
          title: spot.data?.spots_by_pk?.name || '',
          start: start.toDate(),
          end: spotEnd.toDate(),
          color: 'transparent',
          placeId: spot.data?.spots_by_pk?.place_id,
          imageUrl: place.photo,
        })

        setEvents.push(spotEvent)

        if (i === places.length - 1) {
          // 末尾のイベントの場合は次の距離を測れないので抜ける
          break
        }
        if (spotEnd.hour() >= 18) {
          // 時刻がlimit を超えた場合は次の日へ移行する
          start = spotEnd.add(1, 'day').hour(9).minute(0).second(0)
          continue
        }

        const org = [{ placeId: place.placeId }]
        const dest = [{ placeId: places[i + 1].placeId }]
        const result = await distanceMatrix.search(org, dest)

        const moveEnd = spotEnd.add(
          result.rows[0].elements[0].duration.value,
          's'
        )

        if (moveEnd.hour() >= 19) {
          // 時刻がlimit を超えた場合は Move イベントはスキップして次の日へ移行する
          start = spotEnd.add(1, 'day').hour(9).minute(0).second(0)
          continue
        }

        const durationEvent = createEvent({
          title: 'Car',
          start: spotEnd.toDate(),
          end: moveEnd.toDate(),
          color: 'transparent',
        })

        setEvents.push(durationEvent)
        start = moveEnd
      }
    }
    func()
  }, [distanceMatrix, getSpot, places, setEvents])

  const handleEventsSet = (_events: EventApi[]) => {
    if (_events.length > 0) {
      const first = _events[0].start
      const last = _events[events.length - 1].start
      const diff = dayjs(last).diff(first, 'day')
      setDaysDuration(diff + 1)
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
          headerToolbar={{
            left: 'prev,next',
            center: '',
            right: '',
          }}
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
          eventMinHeight={5}
          eventContent={renderEvent}
          eventsSet={handleEventsSet}
          nowIndicator={false}
          events={events} // alternatively, use the `events` setting to fetch from a feed
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
      </StyledWrapper>
    </Box>
  )
}

export default PlanEditor
