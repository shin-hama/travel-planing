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
    countRef.current = 0
  }, [])

  React.useEffect(() => {
    if (countRef.current !== 0) {
      return
    }
    countRef.current += 1

    const func = async () => {
      console.log('Calc route')
      if (!planRef.current) {
        return
      }
      if (planRef.current.waypoints.length === 0) {
        return
      }

      const spots: Array<SpotDTO> = [
        planRef.current.home,
        ...planRef.current.waypoints,
        planRef.current.home,
      ]
      const newRoute = await Promise.all(
        spots.map(async (spot, i): Promise<Route | null> => {
          if (i === spots.length - 1) {
            return null
          }

          const origin = { placeId: spot.placeId }
          const destination = { placeId: spots[i + 1].placeId }

          const routeCache = planRef.current?.routes.find(
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

      setPlan({
        type: 'update',
        value: {
          routes: newRoute.filter((item): item is Route => item !== null),
        },
      })
    }
    func()
  }, [directionService, plan?.waypoints, setPlan])

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
        const newRoutes = planRef.current?.routes.map((route) =>
          route.from === newRoute.from && route.to === newRoute.to
            ? newRoute
            : route
        )
        setPlan({
          type: 'update',
          value: {
            routes: newRoutes,
          },
        })
      },
      addWaypoint: (newSpot: SpotDTO) => {
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
      removeWaypoint: (placeId: string) => {
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
      moveWaypoints: (placeId: string, mode: 'up' | 'down') => {
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
      insertWaypoint: (index: number, newSpot: SpotDTO) => {
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

        if (planRef.current.waypoints.length === 0) {
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

          setPlan({
            type: 'update',
            value: { waypoints: orderedWaypoints, routes: newRoutes },
          })
        }
      },
    }

    return a
  }, [db, directionService, setPlan, user])

  return [plan, actions] as const
}
