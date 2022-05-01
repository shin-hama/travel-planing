import * as React from 'react'
import { useList } from 'react-use'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

import { useEventFactory } from './useEventFactory'
import {
  isRoute,
  isSpot,
  Route,
  ScheduleEvent,
  Spot,
} from 'contexts/CurrentPlanProvider'
import { useTravelPlan } from './useTravelPlan'
import { useDirections } from 'hooks/googlemaps/useDirections'

const nightLimitHour = 19

const mergeAlternate = <T, U>(
  array1: Array<T>,
  array2: Array<U>
): Array<T | U> => {
  const result = []
  const min = Math.min(array1.length, array2.length)

  for (let i = 0; i < min; i++) {
    result.push(array1[i], array2[i])
  }
  result.push(...array1.slice(min), ...array2.slice(min))

  return result
}

type Events = {
  day: number
  eventList: Array<Spot | Route>
}

export const useScheduleEvents = () => {
  const [plan] = useTravelPlan()
  const [events, setEvents] = useList<ScheduleEvent>()
  const eventsRef = React.useRef<typeof events>([])
  eventsRef.current = events
  const { buildMoveEvent, buildSpotEvent } = useEventFactory()

  const [data, setData] = React.useState<Array<Events>>([])
  const { actions: directions } = useDirections()

  React.useEffect(() => {
    if (!plan) {
      return
    }
    if (plan.waypoints.length === 0) {
      console.log('no waypoints')
      setData([])
      setEvents.clear()
      return
    }

    const spots: Array<Spot> = [
      {
        ...plan.home,
        id: `${plan.home.placeId}-start`,
        duration: 30,
        durationUnit: 'minute',
      },
      ...plan.waypoints,
      {
        ...plan.home,
        id: `${plan.home.placeId}-end`,
        duration: 30,
        durationUnit: 'minute',
      },
    ]
    const merged = mergeAlternate(spots, plan.routes)
    const limit = dayjs(plan.startTime).hour(nightLimitHour)

    let key = 0
    const _data: typeof data = [
      {
        day: key,
        eventList: [],
      },
    ]
    merged.forEach((event) => {
      const lastTimestamp = _data[key].eventList.reduce(
        (sum, item) => sum.add(item.duration, item.durationUnit),
        dayjs(plan.startTime)
      )

      if (
        isRoute(event) &&
        !event.to.startsWith(plan.home.placeId) &&
        lastTimestamp.add(event.duration, event.durationUnit).isAfter(limit)
      ) {
        key += 1
        _data.push({ day: key, eventList: [] })
      } else {
        _data[key].eventList.push(event)
      }
    })

    setData(_data)
  }, [plan])

  React.useEffect(() => {
    const func = async () => {
      if (!plan) {
        return
      }

      const _events = await Promise.all(
        data.map(async ({ day, eventList }) => {
          let dayEvents: typeof eventList = eventList

          if (data.length > 1 && plan.lodging) {
            const firstSpot = eventList[0]
            if (isSpot(firstSpot) && firstSpot.placeId !== plan.home.placeId) {
              const result = await directions.search({
                origin: {
                  lat: plan.lodging.lat,
                  lng: plan.lodging.lng,
                },
                destination: { lat: firstSpot.lat, lng: firstSpot.lng },
                mode: 'driving',
              })

              const lodgingId = uuidv4()

              dayEvents = [
                {
                  id: lodgingId,
                  imageUrl: '',
                  name: 'hotel',
                  duration: 30,
                  durationUnit: 'minute',
                  lat: plan.lodging?.lat || 0,
                  lng: plan.lodging?.lng || 0,
                },
                {
                  from: lodgingId,
                  to: firstSpot.id,
                  duration: result?.legs[0].duration?.value || 0,
                  durationUnit: 'second',
                  mode: 'car',
                },
                ...dayEvents,
              ]
            }
            const lastSpot = eventList[eventList.length - 1]
            if (isSpot(lastSpot) && lastSpot.placeId !== plan.home.placeId) {
              const result = await directions.search({
                origin: { lat: lastSpot.lat, lng: lastSpot.lng },
                destination: {
                  lat: plan.lodging.lat,
                  lng: plan.lodging.lng,
                },
                mode: 'driving',
              })
              const lodgingId = uuidv4()

              dayEvents = [
                ...dayEvents,
                {
                  from: lastSpot.id,
                  to: lodgingId,
                  duration: result?.legs[0].duration?.value || 0,
                  durationUnit: 'second',
                  mode: 'car',
                },
                {
                  id: lodgingId,
                  imageUrl: '',
                  name: 'hotel',
                  duration: 30,
                  durationUnit: 'minute',
                  lat: plan.lodging?.lat || 0,
                  lng: plan.lodging?.lng || 0,
                },
              ]
            }
          }

          let startTime = dayjs(plan.startTime).add(day, 'day')

          return dayEvents
            .map((item) => {
              if (isRoute(item)) {
                const start = startTime.toDate()
                startTime = startTime.add(item.duration, item.durationUnit)
                const end = startTime.toDate()

                return buildMoveEvent({
                  start,
                  end,
                  extendedProps: {
                    from: item.from,
                    to: item.to,
                    mode: item.mode,
                  },
                })
              } else if (isSpot(item)) {
                const start = startTime.toDate()
                startTime = startTime.add(item.duration, item.durationUnit)
                const end = startTime.toDate()

                return buildSpotEvent({
                  id: item.id,
                  title: item.name,
                  start,
                  end,
                  props: { placeId: item.placeId, imageUrl: item.imageUrl },
                })
              } else {
                throw Error(`not implemented type: ${JSON.stringify(item)}`)
              }
            })
            .filter((item): item is ScheduleEvent => item !== null)
        })
      )

      setEvents.set(_events.flat())
    }

    func()
  }, [data, plan?.lodging])

  const actions = React.useMemo(() => {
    const a = {
      get: <T extends ScheduleEvent>(
        id: string,
        type?: T['extendedProps']['type']
      ) => {
        return eventsRef.current.find(
          (event): event is T =>
            event.id === id && (type ? event.extendedProps.type === type : true)
        )
      },
      update: (updatedSpot: ScheduleEvent) => {
        setEvents.update((event) => event.id === updatedSpot.id, updatedSpot)
      },
      addSpot: (spot: Parameters<typeof buildSpotEvent>[0]) => {
        const newEvent = buildSpotEvent(spot)
        setEvents.push(newEvent)
      },
      addMove: (move: Parameters<typeof buildMoveEvent>[0]) => {
        const newEvent = buildMoveEvent(move)
        setEvents.push(newEvent)
      },
    }

    return a
  }, [buildMoveEvent, buildSpotEvent, setEvents])

  return [events, actions] as const
}
