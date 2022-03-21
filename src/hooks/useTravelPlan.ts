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
  mode: 'bicycle' | 'car' | 'walk'
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

export const useTravelPlan = () => {
  const plan = React.useContext(CurrentPlanContext)
  const setPlan = React.useContext(SetCurrentPlanContext)

  const planRef = React.useRef<Plan>(plan)

  const [user] = useAuthentication()
  const db = useFirestore()
  const [waypoints, waypointsAction] = useList<SpotDTO>()
  const [routes, routesAction] = useList<Route>()

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
  }, [setPlan])

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
      if (!planRef.current) {
        return
      }
      if (waypoints.length === 0) {
        return
      }

      const spots: Array<SpotDTO> = [
        planRef.current.home,
        ...waypoints,
        planRef.current.home,
      ]
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
            mode: 'car',
          }
        })
      )

      routesAction.set(newRoute.filter((item): item is Route => item !== null))
    }
    func()
    // ignore dependencies to routes
  }, [directionService, waypoints])

  const actions = React.useMemo(() => {
    const a = {
      create: async (newPlan: Omit<Plan, 'id'>) => {
        try {
          if (user) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            const ref = await db.add(path, newPlan)
            setPlan({ type: 'set', value: { ...newPlan, id: ref.id } })
          } else {
            console.log('Current user is guest')
            setPlan({ type: 'set', value: { ...newPlan, id: 'guest' } })
          }
        } catch {
          console.error(`fail to save plan: ${JSON.stringify(newPlan)}`)
        }
      },
      set: (newPlan: Plan) => {
        setPlan({ type: 'set', value: newPlan })
      },
      update: async (updatedPlan: Partial<Plan>) => {
        try {
          if (planRef.current && user) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            await db.set(path, planRef.current.id, updatedPlan)
          }

          // Guest user でも Plan が更新されるように、DB 周りとは隔離して更新する
          setPlan({ type: 'update', value: updatedPlan })
        } catch (e) {
          console.error(updatedPlan)
        }
      },
      updateRoute: (newRoute: Route) => {
        routesAction.update(
          (route) => route.from === newRoute.from && route.to === newRoute.to,
          newRoute
        )
      },
      addWaypoint: (newSpot: SpotDTO) => {
        waypointsAction.push(newSpot)
      },
      removeWaypoint: (placeId: string) => {
        waypointsAction.filter((point) => point.placeId === placeId)
      },
      moveWaypoints: (placeId: string, mode: 'up' | 'down') => {
        const index = waypoints.findIndex((point) => point.placeId === placeId)
        if (index !== 0 || index !== waypoints.length - 1) {
          const newWaypoints = Array.from(waypoints)
          const target = mode === 'up' ? index - 1 : index + 1

          newWaypoints[index] = [
            newWaypoints[target],
            (newWaypoints[target] = newWaypoints[index]),
          ][0]

          waypointsAction.set(newWaypoints)
        } else {
          console.warn(`Cannot move ${mode}`)
        }
      },
      insertWaypoint: (index: number, newSpot: SpotDTO) => {
        waypointsAction.insertAt(index, newSpot)
      },
      save: async () => {
        if (planRef.current && user) {
          const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
          await db.set(path, planRef.current.id, planRef.current)
        }
      },
      optimizeRoute: async () => {
        if (!directionService.isLoaded) {
          console.error('google maps is not loaded')
          return
        }
        if (!planRef.current) {
          console.error('plan is not selected')
          return
        }

        if (waypoints.length === 0) {
          console.warn('There are no waypoints')
          return
        }

        const result = await directionService.search({
          origin: {
            placeId: planRef.current.home.placeId,
          },
          destination: {
            placeId: planRef.current.home.placeId,
          },
          waypoints: planRef.current.waypoints.map((spot) => ({
            location: {
              placeId: spot.placeId,
            },
          })),
          travelMode: google.maps.TravelMode.DRIVING,
        })

        const routeResult = result.routes.shift()
        if (routeResult) {
          const orderedWaypoints = routeResult.waypoint_order
            .map((i) => planRef.current?.waypoints[i] || null)
            .filter((item): item is SpotDTO => item !== null)

          const newSpots = [
            planRef.current.home,
            ...orderedWaypoints,
            planRef.current.home,
          ]
          const newRoutes = newSpots
            .map((spot, index): Route | null => {
              if (index === newSpots.length) {
                return null
              }
              return {
                from: spot.placeId,
                to: spot.placeId,
                duration: routeResult.legs[index].duration?.value || 0,
                durationUnit: 'second',
                mode: 'car',
              }
            })
            .filter((item): item is Route => item !== null)

          routesAction.set(newRoutes)
          waypointsAction.set(orderedWaypoints)
        }
      },
    }

    return a
  }, [db, waypointsAction, user])

  return [plan, actions] as const
}
