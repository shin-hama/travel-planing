import * as React from 'react'
import dayjs from 'dayjs'

import { Plan, Spot } from 'contexts/CurrentPlanProvider'
import { useTravelPlan } from './useTravelPlan'

export const useWaypoints = () => {
  const [plan, planApi] = useTravelPlan()
  const planRef = React.useRef<Plan | null>(null)
  planRef.current = plan
  const waypoints = React.useMemo(
    () => plan?.events.map((event) => event.spots).flat(),
    [plan?.events]
  )

  const actions = React.useMemo(() => {
    const a = {
      add: (newSpot: Spot, day: number) => {
        if (planRef.current) {
          const newEvents =
            planRef.current.events.length > 0
              ? planRef.current?.events.map((event, i) => {
                  if (planRef.current && i === day) {
                    return { ...event, spots: [...event.spots, newSpot] }
                  } else {
                    return event
                  }
                })
              : [
                  {
                    start: dayjs(planRef.current.start)
                      .hour(9)
                      .minute(0)
                      .toDate(),
                    end: dayjs(planRef.current.start)
                      .hour(19)
                      .minute(0)
                      .toDate(),
                    spots: [newSpot],
                  },
                ]

          planApi.update({
            events: newEvents,
          })
        } else {
          console.error('fail to update waypoints')
        }
      },
      remove: (spotId: Spot['id']) => {
        if (planRef.current) {
          planApi.update({
            events: planRef.current?.events.map((event) => ({
              ...event,
              spots: event.spots.filter((spot) => spot.id !== spotId),
            })),
          })
        } else {
          console.error('fail to update waypoints')
        }
      },
      update: (id: string, updatedSpot: Partial<Spot>) => {
        if (!planRef.current) {
          console.error('plan is not selected')
          return
        }

        // 対象の Waypoint を更新した新しいイベントオブジェクトを作成する
        planApi.update({
          events: planRef.current?.events.map((event) => ({
            ...event,
            spots: event.spots.map((spot) =>
              spot.id !== id ? spot : { ...spot, ...updatedSpot }
            ),
          })),
        })
      },
      set: (newWaypoints: Array<Spot>) => {
        if (!planRef.current) {
          console.error('plan is not selected')
          return
        }

        // 対象の Waypoint を更新した新しいイベントオブジェクトを作成する
        planApi.update({
          events: planRef.current?.events
            .filter((_, i) => i === 0)
            .map((event) => ({
              ...event,
              spots: newWaypoints,
            })),
        })
      },
      getDays: () => planRef.current?.events.length || 0,
    }

    return a
  }, [planApi])

  return [waypoints, actions] as const
}
