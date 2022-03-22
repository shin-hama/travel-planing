import * as React from 'react'

import {
  CurrentPlanContext,
  Plan,
  SetCurrentPlanContext,
} from 'contexts/CurrentPlanProvider'
import { SpotDTO } from './usePlanEvents'

export const useWaypoints = () => {
  const plan = React.useContext(CurrentPlanContext)
  const setPlan = React.useContext(SetCurrentPlanContext)
  const planRef = React.useRef<Plan>(plan)

  const actions = React.useMemo(() => {
    const a = {
      add: (newSpot: SpotDTO) => {
        if (planRef.current) {
          setPlan({
            type: 'update',
            value: {
              waypoints: [...planRef.current.waypoints, newSpot],
            },
          })
        } else {
          console.error('fail to update waypoints')
        }
      },
      remove: (placeId: string) => {
        if (planRef.current) {
          setPlan({
            type: 'update',
            value: {
              waypoints: planRef.current.waypoints.filter(
                (item) => item.placeId !== placeId
              ),
            },
          })
        } else {
          console.error('fail to update waypoints')
        }
      },
      move: (placeId: string, mode: 'up' | 'down') => {
        if (!planRef.current) {
          console.error('plan is not selected')
          return
        }
        const index = planRef.current?.waypoints.findIndex(
          (point) => point.placeId === placeId
        )
        if (index !== 0 || index !== planRef.current.waypoints.length - 1) {
          const newWaypoints = planRef.current.waypoints.slice()
          const target = mode === 'up' ? index - 1 : index + 1

          newWaypoints[index] = [
            newWaypoints[target],
            (newWaypoints[target] = newWaypoints[index]),
          ][0]

          setPlan({ type: 'update', value: { waypoints: newWaypoints } })
        } else {
          console.warn(`Cannot move ${mode}`)
        }
      },
      insert: (index: number, newSpot: SpotDTO) => {
        if (!planRef.current) {
          console.error('plan is not selected')
          return
        }
        const newWaypoints = planRef.current.waypoints.slice()
        index > newWaypoints.length
          ? (newWaypoints[index] = newSpot)
          : newWaypoints.splice(index, 0, newSpot)
        setPlan({
          type: 'update',
          value: { waypoints: newWaypoints },
        })
      },
    }

    return a
  }, [setPlan])

  return [plan?.waypoints, actions] as const
}
