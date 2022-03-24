import * as React from 'react'
import dayjs from 'dayjs'

import { ScheduleEvent, SpotDTO } from 'hooks/usePlanEvents'
import { useDirections } from 'hooks/googlemaps/useDirections'

export type Prefecture = {
  name: string
  name_en: string
  lat: number
  lng: number
  zoom: number
  placeId: string
  imageUrl: string
}

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

export type Plan = {
  id: string
  title: string
  home: Prefecture
  destination: Prefecture
  thumbnail: string
  start: Date
  startTime: Date
  end: Date
  waypoints: Array<SpotDTO>
  routes: Array<Route>
  events?: Array<ScheduleEvent>
}

type PlanAction =
  | {
      type: 'set'
      value: Plan
    }
  | {
      type: 'update'
      value: Partial<Plan>
    }

const planReducer = (state: Plan | null, action: PlanAction): Plan | null => {
  switch (action.type) {
    case 'set':
      return action.value

    case 'update':
      if (state === null) {
        console.warn('Cannot update plan before selecting')
        return null
      }
      return { ...state, ...action.value }

    default:
      throw new Error(`Action: "${action}" is not implemented`)
  }
}

export const CurrentPlanContext = React.createContext<Plan | null>(null)
export const SetCurrentPlanContext = React.createContext<
  React.Dispatch<PlanAction>
>(() => {
  throw new Error('CurrentPlanContextProvider is not wrapped')
})

export const CurrentPlanContextProvider: React.FC = ({ children }) => {
  const [plan, setPlan] = React.useReducer(planReducer, null)
  const { actions: directionService } = useDirections()

  React.useEffect(() => {
    console.log('update route : ')

    const func = async () => {
      if (!plan) {
        console.log('plan is not selected')
        return
      }
      if (plan.waypoints.length === 0) {
        console.log('There are no waypoints')
        return
      }

      const spots: Array<SpotDTO> = [
        { ...plan.home, duration: 30, durationUnit: 'minute' },
        ...plan.waypoints,
        { ...plan.home, duration: 30, durationUnit: 'minute' },
      ]

      const newRoute = await Promise.all(
        spots.map(async (spot, i): Promise<Route | null> => {
          if (i === spots.length - 1) {
            return null
          }

          const origin = { placeId: spot.placeId }
          const destination = { placeId: spots[i + 1].placeId }

          const routeCache = plan.routes.find(
            (route) =>
              route.from === origin.placeId && route.to === destination.placeId
          )
          if (routeCache) {
            // 計算済みの値があればそれを再利用する
            console.log('use route cache')
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
    // 余計な計算を行わないために、waypoints と home だけに依存させる
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan?.waypoints, plan?.home])

  return (
    <CurrentPlanContext.Provider value={plan}>
      <SetCurrentPlanContext.Provider value={setPlan}>
        {children}
      </SetCurrentPlanContext.Provider>
    </CurrentPlanContext.Provider>
  )
}
