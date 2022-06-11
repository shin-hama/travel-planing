import * as React from 'react'
import dayjs from 'dayjs'

import { useAuthentication } from 'hooks/firebase/useAuthentication'
import { usePlans } from 'hooks/usePlans'
import { TravelMode } from 'hooks/googlemaps/useDirections'

export type NextMove = {
  id: string
  mode: TravelMode
}

export type SpotBase = {
  id: string
  lat: number
  lng: number
  name: string
}
export type RouteGuidanceAvailable = SpotBase & {
  next?: NextMove
}

export type Prefecture = SpotBase & {
  name: string
  name_en: string
  zoom: number
  imageUrl: string
}

export type SpotLabel = string

export type Spot = RouteGuidanceAvailable & {
  imageUrl: string
  placeId?: string | null
  duration: number
  durationUnit: dayjs.ManipulateType
  labels?: Array<SpotLabel>
  memo?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isSpot = (obj: any): obj is Spot => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.imageUrl === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.lat === 'number' &&
    typeof obj.lng === 'number'
  )
}

export type Time = {
  text: string
  value: number
  unit: 'second' | 'minute'
}

export type Route = {
  from: string
  to: string
  mode: TravelMode
  time?: Time | null
  memo?: string | null
}

export const isSameRoute = (a: Route, b: Route) =>
  a.from === b.from && a.to === b.to && a.mode === b.mode

export type Belonging = {
  name: string
  checked: boolean
}

export type Schedule = {
  start: Date
  end: Date
  dept?: NextMove
  spots: Array<Spot>
}

export type Plan = {
  title: string
  home: Prefecture
  destination: Prefecture
  thumbnail: string
  start: Date
  startTime: Date
  end: Date
  events: Array<Schedule>
  routes: Array<Route>
  lodging?: SpotBase
  belongings: Array<Belonging>
  /**
   * 宿泊日数、未定なら null
   */
  days?: number | null
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
      return {
        id: state.id,
        data: {
          ...state.data,
          ...action.value,
        },
      }

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
  const [, planDBApi] = usePlans()
  const [currentPlan, setPlan] = React.useReducer(planReducer, null)

  const [user] = useAuthentication()

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
      const saved = await planDBApi.save(user.uid, currentPlan)
      setPlan({ type: 'set', value: saved })
    }, 500)
  }, [currentPlan, planDBApi, user])

  return (
    <CurrentPlanContext.Provider value={currentPlan}>
      <SetCurrentPlanContext.Provider value={setPlan}>
        {children}
      </SetCurrentPlanContext.Provider>
    </CurrentPlanContext.Provider>
  )
}
