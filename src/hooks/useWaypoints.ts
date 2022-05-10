import * as React from 'react'

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
      add: (newSpot: Spot) => {
        if (planRef.current) {
          planApi.update({
            events: planRef.current?.events.map((event, i) => {
              if (planRef.current && i === planRef.current?.events.length - 1) {
                return { ...event, spots: [...event.spots, newSpot] }
              } else {
                return event
              }
            }),
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
    }

    return a
  }, [planApi])

  return [waypoints, actions] as const
}
