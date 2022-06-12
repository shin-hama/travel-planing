import * as React from 'react'
import dayjs from 'dayjs'

import { TravelMode } from 'hooks/googlemaps/useDirections'
import { DocumentReference } from 'firebase/firestore'
import {
  PLANING_USERS_PLANS_COLLECTIONS,
  useFirestore,
} from 'hooks/firebase/useFirestore'
import { planConverter } from 'hooks/usePlans'
import { DocActions, useDocument } from 'hooks/firebase/useDocument'

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

export const CurrentPlanContext = React.createContext<Plan | null>(null)
export const CurrentPlanRefContext =
  React.createContext<DocumentReference<Plan> | null>(null)

type PlanActions = DocActions<Plan>
export const CurrentPlanActionsContext =
  React.createContext<PlanActions | null>(null)

type Props = {
  query: {
    userId: string
    planId: string
  }
}
export const CurrentPlanContextProvider: React.FC<Props> = ({
  children,
  query,
}) => {
  const [currentPlan, setPlan] = React.useState<DocumentReference<Plan> | null>(
    null
  )
  const db = useFirestore()

  const [plan, docActions] = useDocument(currentPlan, planConverter)

  const actions = React.useMemo(() => {
    const a = {
      ...docActions,
    }

    return a
  }, [docActions])

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const path = PLANING_USERS_PLANS_COLLECTIONS(query.userId)
        const result = await db.get(path, query.planId, planConverter)
        setPlan(result.ref)
      } catch (e) {
        console.error(e)
        setPlan(null)
      }
    }
    fetch()
  }, [db, query.planId, query.userId])

  return (
    <CurrentPlanRefContext.Provider value={currentPlan}>
      <CurrentPlanContext.Provider value={plan}>
        <CurrentPlanActionsContext.Provider value={actions}>
          {children}
        </CurrentPlanActionsContext.Provider>
      </CurrentPlanContext.Provider>
    </CurrentPlanRefContext.Provider>
  )
}
