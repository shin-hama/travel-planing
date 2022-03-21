import * as React from 'react'
import { useList } from 'react-use'
import dayjs from 'dayjs'

import { useEventFactory } from './useEventFactory'
import { isRoute } from './useTravelPlan'
import { isSpotDTO, ScheduleEvent } from './usePlanEvents'
import { Plan } from 'contexts/CurrentPlanProvider'

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

export const useScheduleEvents = (plan: Plan) => {
  const [events, setEvents] = useList<ScheduleEvent>()
  const eventsRef = React.useRef<typeof events>([])
  eventsRef.current = events
  const { buildMoveEvent, buildSpotEvent } = useEventFactory()

  React.useEffect(() => {
    console.log('setEvents is update')
  }, [setEvents])

  React.useEffect(() => {
    console.log('plan is update')
  }, [plan])

  React.useEffect(() => {
    console.log('calc route')

    if (plan.waypoints.length === 0) {
      console.log('no waypoints')
      setEvents.clear()
      return
    }
    let startTime = dayjs('08:30:00', 'HH:mm:ss')

    const spots = [plan.home, ...plan.waypoints, plan.home]
    const merged = mergeAlternate(spots, plan.routes)

    setEvents.set(
      merged.map((item) => {
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
        } else if (isSpotDTO(item)) {
          const start = startTime.toDate()
          startTime = startTime.add(1, 'hour')
          const end = startTime.toDate()

          return buildSpotEvent({
            title: item.name,
            start,
            end,
            props: { placeId: item.placeId, imageUrl: item.imageUrl },
          })
        } else {
          throw Error(`not implemented type: ${JSON.stringify(item)}`)
        }
      })
    )
  }, [buildMoveEvent, buildSpotEvent, plan, setEvents])

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
      followMoving: (
        target: ScheduleEvent,
        duration: number,
        unit: dayjs.ManipulateType
      ) => {
        eventsRef.current
          .filter(
            (event) => dayjs(event.start).date() === dayjs(target.end).date()
          )
          .forEach((event) => {
            actions.update({
              ...event,
              start: dayjs(event.start).add(duration, unit).toDate(),
              end: dayjs(event.end).add(duration, unit).toDate(),
            })
          })
      },
      update: (updatedSpot: ScheduleEvent) => {
        setEvents.update((event) => event.id === updatedSpot.id, updatedSpot)
      },
    }

    return a
  }, [setEvents])

  return [events, actions] as const
}
