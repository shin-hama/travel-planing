import * as React from 'react'

import {
  CurrentPlanContext,
  Plan,
  SetCurrentPlanContext,
  SpotDTO,
} from 'contexts/CurrentPlanProvider'

export const useWaypoints = () => {
  const plan = React.useContext(CurrentPlanContext)
  const setPlan = React.useContext(SetCurrentPlanContext)
  const planRef = React.useRef<Plan | null>(null)
  planRef.current = plan?.data || null

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
      swap: (index: number, target: number) => {
        if (!planRef.current) {
          console.error('plan is not selected')
          return
        }

        if (
          target >= 0 &&
          target < planRef.current.waypoints.length &&
          index >= 0 &&
          index < planRef.current.waypoints.length
        ) {
          const newWaypoints = planRef.current.waypoints.slice()
          newWaypoints[index] = [
            newWaypoints[target],
            (newWaypoints[target] = newWaypoints[index]),
          ][0]

          setPlan({ type: 'update', value: { waypoints: newWaypoints } })
        } else {
          console.warn(
            `Cannot move from ${index} to ${target}, waypoints.length: ${planRef.current.waypoints.length}`
          )
        }
      },
      insert: (index: number, newSpot: SpotDTO) => {
        if (!planRef.current) {
          console.error('plan is not selected')
          return
        }

        const newWaypoints = planRef.current.waypoints.slice()
        // 入力された index がリストの長さより長い場合は末尾に追加
        index > newWaypoints.length
          ? newWaypoints.push(newSpot)
          : newWaypoints.splice(index, 0, newSpot)

        setPlan({
          type: 'update',
          value: { waypoints: newWaypoints },
        })
      },
      move: (placeId: string, index: number) => {
        if (!planRef.current) {
          return
        }

        const waypoints = planRef.current.waypoints.slice()
        const currentIndex = waypoints.findIndex(
          (spot) => spot.placeId === placeId
        )

        waypoints.splice(index, 0, waypoints.splice(currentIndex, 1)[0])

        setPlan({ type: 'update', value: { waypoints } })
      },
      update: (placeId: string, updatedSpot: Partial<SpotDTO>) => {
        if (!planRef.current) {
          console.error('plan is not selected')
          return
        }

        // 対象の Waypoint を更新した新しいリストを作成する
        const newWaypoints = planRef.current.waypoints.map((spot) =>
          spot.placeId === placeId ? { ...spot, ...updatedSpot } : spot
        )

        setPlan({ type: 'update', value: { waypoints: newWaypoints } })
      },
    }

    return a
  }, [setPlan])

  return [plan?.data.waypoints, actions] as const
}
