import * as React from 'react'
import { useList } from 'react-use'
import dayjs from 'dayjs'

import { useEventFactory } from './useEventFactory'
import {
  isRoute,
  isSpotDTO,
  ScheduleEvent,
  Spot,
} from 'contexts/CurrentPlanProvider'
import { useTravelPlan } from './useTravelPlan'

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

export const useScheduleEvents = () => {
  const [plan] = useTravelPlan()
  const [events, setEvents] = useList<ScheduleEvent>()
  const eventsRef = React.useRef<typeof events>([])
  eventsRef.current = events
  const { buildMoveEvent, buildSpotEvent } = useEventFactory()

  React.useEffect(() => {
    console.log('build route events')
    if (!plan) {
      return
    }

    if (plan.waypoints.length === 0) {
      console.log('no waypoints')
      setEvents.clear()
      return
    }
    let startTime = dayjs(plan.startTime)

    const spots: Array<Spot> = [
      { ...plan.home, duration: 30, durationUnit: 'minute' },
      ...plan.waypoints,
      { ...plan.home, duration: 30, durationUnit: 'minute' },
    ]
    const merged = mergeAlternate(spots, plan.routes)

    setEvents.set(
      merged
        .map((item) => {
          if (isRoute(item)) {
            const start = startTime.toDate()
            startTime = startTime.add(item.duration, item.durationUnit)
            const end = startTime.toDate()
            if (
              start.getHours() < 6 ||
              start.getHours() >= 21 ||
              end.getHours() < 6 ||
              end.getHours() >= 21
            ) {
              // 深夜にイベントが作られないように次の日へ移行する(Move イベントはスキップする)
              startTime = dayjs(start)
                .add(1, 'day')
                .set('hour', plan.startTime.getHours())
                .set('minute', plan.startTime.getMinutes())
              return null
            }

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
    )
    // 余計な処理を行わないために、plan の変更のみに依存させる
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan?.waypoints, plan?.home, plan?.startTime, plan?.routes])

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
    }

    return a
  }, [setEvents])

  return [events, actions] as const
}
