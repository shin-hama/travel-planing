import * as React from 'react'

import {
  PLANING_USERS_PLANS_COLLECTIONS,
  useFirestore,
} from './firebase/useFirestore'
import { useAuthentication } from './firebase/useAuthentication'
import {
  CurrentPlanContext,
  Plan,
  SetCurrentPlanContext,
} from 'contexts/CurrentPlanProvider'
import { useList } from 'react-use'
import { SpotDTO } from './usePlanEvents'
import { useDirections } from './googlemaps/useDirections'
import dayjs from 'dayjs'

export type Route = {
  from: string
  to: string
  duration: number
  durationUnit: dayjs.ManipulateType
  mode: google.maps.TravelMode
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRoute = (obj: any): obj is Route => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.duration === 'number' &&
    typeof obj.from === 'string' &&
    typeof obj.to === 'string'
  )
}

export type TravelPlan = Plan & {
  waypoints: Array<SpotDTO>
  routes: Array<Route>
}

export const useTravelPlan = () => {
  const plan = React.useContext(CurrentPlanContext)
  const setPlan = React.useContext(SetCurrentPlanContext)

  if (!plan) {
    throw Error('Current plan is not set')
  }

  const [user] = useAuthentication()
  const db = useFirestore()
  const [waypoints, setWaypoints] = useList<SpotDTO>()
  const [routes, setRoutes] = useList<Route>()

  const { actions: directionService } = useDirections()
  const countRef = React.useRef(0)

  React.useEffect(() => {
    console.log('direction service is updated')
  }, [directionService])

  React.useEffect(() => {
    console.log('plan is updated')
  }, [plan])

  React.useEffect(() => {
    console.log('setplan is updated')
  }, [plan])

  React.useEffect(() => {
    console.log('waypoints is updated')
    setPlan({ type: 'update', value: { waypoints } })
    countRef.current = 0
  }, [waypoints])

  React.useEffect(() => {
    console.log('route is updated')

    setPlan({ type: 'update', value: { routes } })
  }, [routes])

  React.useEffect(() => {
    if (countRef.current !== 0) {
      return
    }
    countRef.current += 1

    const func = async () => {
      if (!plan) {
        return
      }
      if (waypoints.length === 0) {
        return
      }

      const spots: Array<SpotDTO> = [plan.home, ...waypoints, plan.home]
      const newRoute = await Promise.all(
        spots.map(async (spot, i): Promise<Route | null> => {
          if (i === spots.length - 1) {
            return null
          }

          const origin = { placeId: spot.placeId }
          const destination = { placeId: spots[i + 1].placeId }

          const routeCache = routes.find(
            (route) =>
              route.from === origin.placeId && route.to === destination.placeId
          )
          if (routeCache) {
            // 計算済みの値があればそれを再利用する
            return routeCache
          }

          const travelMode = google.maps.TravelMode.DRIVING

          const result = await directionService.search({
            origin,
            destination,
            travelMode,
          })

          return {
            from: origin.placeId,
            to: destination.placeId,
            duration: result.routes[0].legs[0].duration?.value || 0,
            durationUnit: 'second',
            mode: travelMode,
          }
        })
      )

      setRoutes.set(newRoute.filter((item): item is Route => item !== null))
    }
    func()
  }, [directionService, plan.home, waypoints])

  const actions = React.useMemo(() => {
    const a = {
      update: async (updatedPlan: Partial<Plan>) => {
        try {
          if (user) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            await db.set(path, plan.id, updatedPlan)
          }

          // Guest user でも Plan が更新されるように、DB 周りとは隔離して更新する
          setPlan({ type: 'update', value: updatedPlan })
        } catch (e) {
          console.error(updatedPlan)
        }
      },
      addWaypoint: (newSpot: SpotDTO) => {
        setWaypoints.push(newSpot)
      },
      removeWaypoint: (target: SpotDTO) => {
        setWaypoints.filter((point) => point.placeId === target.placeId)
      },
    }

    return a
  }, [db, plan.id, setWaypoints, user])

  return [plan, actions] as const
}
