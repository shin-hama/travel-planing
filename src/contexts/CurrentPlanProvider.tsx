import * as React from 'react'
import dayjs from 'dayjs'
import { EventInput } from '@fullcalendar/react' // must go before plugins
import { v4 as uuidv4 } from 'uuid'

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

export type Spot = {
  id: string
  imageUrl: string
  placeId?: string | null
  name: string
  duration: number
  durationUnit: dayjs.ManipulateType
  lat: number
  lng: number
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isSpotDTO = (obj: any): obj is Spot => {
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
export type SpotProps = Pick<Spot, 'placeId' | 'imageUrl'> & {
  type: 'spot'
  from: string | null
  to: string | null
}
export type MoveProps = {
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
  extendedProps: SpotProps
}
export type MoveEvent = EventBase & {
  extendedProps: MoveProps
}

export type ScheduleEvent = SpotEvent | MoveEvent
export type Plan = {
  title: string
  home: Prefecture
  destination: Prefecture
  thumbnail: string
  start: Date
  startTime: Date
  end: Date
  waypoints: Array<Spot>
  routes: Array<Route>
  events?: Array<ScheduleEvent>
}

export type PlanDB = {
  id: string
  data: Plan
}

type PlanAction =
  | {
      type: 'set'
      value: PlanDB
    }
  | {
      type: 'clear'
    }
  | {
      type: 'create'
      value: Plan
    }
  | {
      type: 'update'
      value: Partial<Plan>
    }

const planReducer = (
  state: PlanDB | null,
  action: PlanAction
): PlanDB | null => {
  switch (action.type) {
    case 'create':
      return { id: '', data: action.value }

    case 'set':
      return action.value

    case 'update':
      if (state === null) {
        console.warn('Cannot update plan before selecting')
        return null
      }
      return { id: state.id, data: { ...state.data, ...action.value } }

    case 'clear':
      return null

    default:
      throw new Error(`Action: "${action}" is not implemented`)
  }
}

export const CurrentPlanContext = React.createContext<PlanDB | null>(null)
export const SetCurrentPlanContext = React.createContext<
  React.Dispatch<PlanAction>
>(() => {
  throw new Error('CurrentPlanContextProvider is not wrapped')
})

export const CurrentPlanContextProvider: React.FC = ({ children }) => {
  const [currentPlan, setPlan] = React.useReducer(planReducer, null)
  const { actions: directionService } = useDirections()

  const [user] = useAuthentication()
  const db = useFirestore()

  React.useEffect(() => {
    const func = async () => {
      if (!currentPlan) {
        console.log('plan is not selected')
        return
      }
      const { data: plan } = currentPlan
      if (plan.waypoints.length === 0) {
        console.log('There are no waypoints')
        return
      }

      const spots: Array<Spot> = [
        { ...plan.home, id: uuidv4(), duration: 30, durationUnit: 'minute' },
        ...plan.waypoints,
        { ...plan.home, id: uuidv4(), duration: 30, durationUnit: 'minute' },
      ]

      const newRoute = await Promise.all(
        spots.map(async (spot, i): Promise<Route | null> => {
          if (i === spots.length - 1) {
            return null
          }

          const origin = { lat: spot.lat, lng: spot.lng, id: spot.id }
          const destination = {
            lat: spots[i + 1].lat,
            lng: spots[i + 1].lng,
            id: spots[i + 1].id,
          }

          const routeCache = plan.routes.find(
            (route) => route.from === origin.id && route.to === destination.id
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
            from: origin.id,
            to: destination.id,
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
  }, [currentPlan?.data.waypoints, currentPlan?.data.home])

  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  React.useEffect(() => {
    // 連続して保存が実行されないように、タイムアウト処理で管理
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (!currentPlan || !user) {
      return
    }

    timerRef.current = setTimeout(async () => {
      console.log('save plan')
      const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
      if (currentPlan.id !== '' && user) {
        db.set(path, currentPlan.id, currentPlan.data)
      } else {
        const ref = await db.add(path, currentPlan.data)
        setPlan({ type: 'set', value: { id: ref.id, data: currentPlan.data } })
      }
    }, 500)
  }, [currentPlan, db, user])

  return (
    <CurrentPlanContext.Provider value={currentPlan}>
      <SetCurrentPlanContext.Provider value={setPlan}>
        {children}
      </SetCurrentPlanContext.Provider>
    </CurrentPlanContext.Provider>
  )
}
