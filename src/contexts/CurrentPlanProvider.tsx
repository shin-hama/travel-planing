import * as React from 'react'
import dayjs from 'dayjs'

import { TravelMode } from 'hooks/googlemaps/useDirections'
import { collection, doc, DocumentReference, getDoc } from 'firebase/firestore'
import { PLANING_USERS_PLANS_COLLECTIONS } from 'hooks/firebase/useFirestore'
import { planConverter } from 'hooks/usePlans'
import { DocActions, useDocument } from 'hooks/firebase/useDocument'
import { CurrentSchedulesContextProvider } from './CurrentSchedulesProvider'
import { CurrentEventsContextProvider } from './CurrentEventsProvider'
import { db } from 'configs'
import { Schedule } from 'hooks/useSchedules'
import { KeyValue } from 'components/modules/KeyValues'

export type Time = {
  text: string
  value: number
  unit: 'second' | 'minute'
}

type LatLng = {
  lat: number
  lng: number
}

export type Route = {
  from: LatLng
  to: LatLng
  mode: TravelMode
  time?: Time | null
  memo?: string | null
}

export const isSameRoute = (a: Route, b: Route) =>
  a.from.lat === b.from.lat &&
  a.from.lng === b.from.lng &&
  a.to.lat === b.to.lat &&
  a.to.lng === b.to.lng &&
  a.mode === b.mode

export type SpotBase = LatLng & {
  name: string
}

export type RouteGuidanceAvailable = SpotBase & {
  next?: Route
}

export type Prefecture = SpotBase & {
  name: string
  name_en: string
  zoom: number
  imageUrl?: string
}

export type SpotLabel = string

type StorageImage = {
  url: string
  ref?: string | null
}

export type Spot = RouteGuidanceAvailable & {
  placeId?: string | null
  duration: number
  durationUnit: dayjs.ManipulateType
  labels?: Array<SpotLabel>
  memo?: string
  position: number
  schedule: DocumentReference<Schedule>
  image?: StorageImage | null
  information?: Array<KeyValue> | null
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

export type Belonging = {
  name: string
  checked: boolean
}

export type Plan = {
  title: string
  home: Prefecture
  destination: Prefecture
  image: StorageImage
  start: Date
  startTime: Date
  end: Date
  lodging?: SpotBase
  belongings: Array<Belonging>
  /**
   * 宿泊日数、未定なら null
   */
  days?: number | null
  published: boolean
  comment?: string
}

export const CurrentPlanContext = React.createContext<Plan | null>(null)
export const CurrentPlanDocContext =
  React.createContext<DocumentReference<Plan> | null>(null)

type PlanActions = DocActions<Plan>
export const CurrentPlanActionsContext =
  React.createContext<PlanActions | null>(null)

export const PLANS_SUB_COLLECTIONS = (userId: string) => {
  const path = PLANING_USERS_PLANS_COLLECTIONS(userId)
  return collection(db, path).withConverter(planConverter)
}

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
  const [currentPlanDoc, setPlan] =
    React.useState<DocumentReference<Plan> | null>(null)

  const [plan, docActions] = useDocument(currentPlanDoc)

  const actions = React.useMemo(() => {
    const a = {
      ...docActions,
    }

    return a
  }, [docActions])

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const result = await getDoc(
          doc(PLANS_SUB_COLLECTIONS(query.userId), query.planId)
        )
        setPlan(result.ref)
      } catch (e) {
        console.error(e)
        setPlan(null)
      }
    }
    fetch()
  }, [query.planId, query.userId])

  return (
    <CurrentPlanDocContext.Provider value={currentPlanDoc}>
      <CurrentPlanContext.Provider value={plan}>
        <CurrentPlanActionsContext.Provider value={actions}>
          <CurrentSchedulesContextProvider planDoc={currentPlanDoc}>
            <CurrentEventsContextProvider planDoc={currentPlanDoc}>
              {children}
            </CurrentEventsContextProvider>
          </CurrentSchedulesContextProvider>
        </CurrentPlanActionsContext.Provider>
      </CurrentPlanContext.Provider>
    </CurrentPlanDocContext.Provider>
  )
}
