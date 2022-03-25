import * as React from 'react'

import {
  PLANING_USERS_PLANS_COLLECTIONS,
  useFirestore,
} from './firebase/useFirestore'
import { useAuthentication } from './firebase/useAuthentication'
import {
  CurrentPlanContext,
  Plan,
  Route,
  SetCurrentPlanContext,
  SpotDTO,
} from 'contexts/CurrentPlanProvider'
import { useDirections } from './googlemaps/useDirections'

export interface PlanAPI {
  create: (newPlan: Omit<Plan, 'id'>) => Promise<void>
  optimizeRoute: () => Promise<void>
  set: (newPlan: Plan) => void
  update: (updated: Partial<Plan>) => Promise<void>
}

export const useTravelPlan = () => {
  const plan = React.useContext(CurrentPlanContext)
  const setPlan = React.useContext(SetCurrentPlanContext)

  const planRef = React.useRef<Plan | null>(null)
  planRef.current = plan

  const [user] = useAuthentication()
  const db = useFirestore()

  const { actions: directionService } = useDirections()

  const actions: PlanAPI = React.useMemo(() => {
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
  }, [db, directionService, setPlan, user])

  return [plan, actions] as const
}
