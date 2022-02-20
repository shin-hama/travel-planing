import * as React from 'react'
import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import FullCalendar, { EventInput } from '@fullcalendar/react' // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'
import { useList } from 'react-use'

import { SelectedPlacesContext } from 'contexts/SelectedPlacesProvider'
import { useDistanceMatrix } from 'hooks/useDistanceMatrix'
import { useGetSpotByPkLazyQuery } from 'generated/graphql'

const StyledWrapper = styled('div')`
  height: 100%;
  .fc {
    height: 100%;
  }
`
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

export const createEvents = () => {
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
  const places = React.useContext(SelectedPlacesContext)

  const [getSpot] = useGetSpotByPkLazyQuery()
  const distanceMatrix = useDistanceMatrix()
  // to avoid the bug that infinite rerender and recall api after every api call
  const distCountRef = React.useRef(0)

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
      const start = moment('08:00:00', 'HH:mm:ss')
      for (const [i, place] of places.entries()) {
        const spot = await getSpot({
          variables: { place_id: place.placeId },
        })

        const startClone = start.clone()
        start.add('00:60:00')
        const spotEvent = createEvent({
          title: spot.data?.spots_by_pk?.name || '',
          start: startClone.toDate(),
          end: start.toDate(),
          color: '',
        })
        setEvents.push(spotEvent)
        if (i === places.length - 1) {
          break
        }

        const org = [{ placeId: place.placeId }]
        const dest = [{ placeId: places[i + 1].placeId }]
        const result = await distanceMatrix.search(org, dest)

        const moveStart = start.clone()
        start.add(result.rows[0].elements[0].duration.value, 's')
        const durationEvent = createEvent({
          title: 'Car',
          start: moveStart.toDate(),
          end: start.toDate(),
          color: 'limegreen',
        })

        setEvents.push(durationEvent)
      }
    }
    func()
  }, [distanceMatrix, getSpot, places, setEvents])

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '100%',
      }}>
      <StyledWrapper>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next',
            center: '',
            right: 'timeGridDay',
          }}
          initialView="timeGridDay"
          slotDuration={'00:15:00'}
          slotLabelInterval={'01:00:00'}
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            hour12: false,
            omitZeroMinute: false,
            meridiem: 'short',
          }}
          dayHeaders={false}
          allDaySlot={false}
          editable={true}
          selectable={true}
          selectMirror={true}
          droppable={true}
          dayMaxEvents={true}
          weekends={true}
          eventMinHeight={5}
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
