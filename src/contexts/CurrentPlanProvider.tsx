import * as React from 'react'
import dayjs from 'dayjs'
import { EventInput } from '@fullcalendar/react' // must go before plugins

import { useDirections } from 'hooks/googlemaps/useDirections'
import { useAuthentication } from 'hooks/firebase/useAuthentication'
import {
  PLANING_USERS_PLANS_COLLECTIONS,
  useFirestore,
} from 'hooks/firebase/useFirestore'

export type Prefecture = {
  name: string
  name_en: string
  lat: number
  lng: number
  zoom: number
  placeId: string
  imageUrl: string
}

export type SpotDTO = {
  imageUrl: string
  placeId: string
  name: string
  duration: number
  durationUnit: dayjs.ManipulateType
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isSpotDTO = (obj: any): obj is SpotDTO => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.imageUrl === 'string' &&
    typeof obj.placeId === 'string' &&
    typeof obj.name === 'string'
  )
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
export type Spot = {
  type: 'spot'
  placeId: string
  imageUrl: string
  from: string | null
  to: string | null
}
export type Move = {
  type: 'move'
  from: string
  to: string
  mode: 'bicycle' | 'car' | 'walk'
}

type CustomEventInput = Omit<EventInput, 'extendedProps'>
export type EventBase = CustomEventInput & {
  id: string
  start: Date
  end: Date
}
export type SpotEvent = EventBase & {
  extendedProps: Spot
}
export type MoveEvent = EventBase & {
  extendedProps: Move
}

export type ScheduleEvent = SpotEvent | MoveEvent
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

  const [user] = useAuthentication()
  const db = useFirestore()

  React.useEffect(() => {
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

  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  React.useEffect(() => {
    // 連続して保存が実行されないように、タイムアウト処理で管理
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (!plan || !user) {
      return
    }

    timerRef.current = setTimeout(async () => {
      console.log('save plan')
      const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
      if (plan?.id && user) {
        db.set(path, plan.id, plan)
      } else {
        const ref = await db.add(path, plan)
        setPlan({ type: 'set', value: { ...plan, id: ref.id } })
      }
    }, 500)
  }, [plan, db, user])

  return (
    <CurrentPlanContext.Provider value={plan}>
      <SetCurrentPlanContext.Provider value={setPlan}>
        {children}
      </SetCurrentPlanContext.Provider>
    </CurrentPlanContext.Provider>
  )
}
