import * as React from 'react'

import {
  CurrentPlanContext,
  Plan,
  Route,
  SetCurrentPlanContext,
  SpotDTO,
} from 'contexts/CurrentPlanProvider'
import { useDirections } from './googlemaps/useDirections'
import {
  PLANING_USERS_PLANS_COLLECTIONS,
  useFirestore,
} from './firebase/useFirestore'
import { useAuthentication } from './firebase/useAuthentication'

export interface PlanAPI {
  create: (newPlan: Plan) => Promise<string | undefined>
  clear: () => void
  delete: () => Promise<void>
  optimizeRoute: () => Promise<void>
  set: (id: string, newPlan: Plan) => void
  update: (updated: Partial<Plan>) => void
}

export const useTravelPlan = () => {
  const plan = React.useContext(CurrentPlanContext)
  const setPlan = React.useContext(SetCurrentPlanContext)

  const [user] = useAuthentication()
  const db = useFirestore()

  const planRef = React.useRef<Plan | null>(null)
  planRef.current = plan?.data || null

  const { actions: directionService } = useDirections()

  const actions = React.useMemo<PlanAPI>(() => {
    const a: PlanAPI = {
      create: async (newPlan: Plan): Promise<string | undefined> => {
        try {
          if (user) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            const ref = await db.add(path, newPlan)

            actions.set(ref.id, newPlan)
            return ref.id
          }
        } catch (e) {
          console.error(e)
        }
      },
      clear: () => {
        setPlan({ type: 'clear' })
      },
      set: (id: string, newPlan: Plan) => {
        setPlan({ type: 'set', value: { id, data: newPlan } })
      },
      update: (updatedPlan: Partial<Plan>) => {
        try {
          // Guest user でも Plan が更新されるように、DB 周りとは隔離して更新する
          setPlan({ type: 'update', value: updatedPlan })
        } catch (e) {
          console.error(updatedPlan)
        }
      },
      delete: async () => {
        try {
          if (user && plan) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            await db.delete(path, plan.id)
            setPlan({ type: 'clear' })
          }
        } catch (e) {
          console.error(e)
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

          const newSpots: Array<SpotDTO> = [
            { ...planRef.current.home, duration: 30, durationUnit: 'minute' },
            ...orderedWaypoints,
            { ...planRef.current.home, duration: 30, durationUnit: 'minute' },
          ]
          const newRoutes = newSpots
            .map((spot, index): Route | null => {
              if (index === newSpots.length - 1) {
                return null
              }
              return {
                from: spot.placeId,
                to: newSpots[index + 1].placeId,
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
  }, [db, directionService, plan, setPlan, user])

  return [plan?.data || null, actions] as const
}
