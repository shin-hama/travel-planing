import * as React from 'react'
import { useList } from 'react-use'
import dayjs from 'dayjs'

import { useEventFactory } from './useEventFactory'
import { isRoute, TravelPlan } from './useTravelPlan'
import { isSpotDTO, ScheduleEvent } from './usePlanEvents'

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

export const useScheduleEvents = (plan: TravelPlan) => {
  const [events, setEvents] = useList<ScheduleEvent>()
  const actions = useEventFactory()

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
          const endTime = startTime.add(item.duration, item.durationUnit)
          startTime = endTime

          return actions.buildMoveEvent({
            start: startTime.toDate(),
            end: endTime.toDate(),
            extendedProps: {
              from: item.from,
              to: item.to,
              mode: item.mode,
            },
          })
        } else if (isSpotDTO(item)) {
          const endTime = startTime.add(1, 'hour')
          startTime = endTime

          return actions.buildSpotEvent({
            id: item.placeId,
            title: item.name,
            start: startTime.toDate(),
            end: endTime.toDate(),
            props: { placeId: item.placeId, imageUrl: item.imageUrl },
          })
        } else {
          throw Error(`not implemented type: ${JSON.stringify(item)}`)
        }
      })
    )
  }, [actions, plan, setEvents])

  return events
}
