import * as React from 'react'
import {
  collection,
  DocumentReference,
  FirestoreDataConverter,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  SnapshotOptions,
} from 'firebase/firestore'

import { Plan, Spot } from './CurrentPlanProvider'

export const CurrentEventsContext =
  React.createContext<QuerySnapshot<Spot> | null>(null)

const converter: FirestoreDataConverter<Spot> = {
  toFirestore: (spot: Spot) => {
    return {
      ...spot,
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Spot => {
    const data = snapshot.data(options)
    return {
      lat: data.lat,
      lng: data.lng,
      name: data.name,
      duration: data.duration,
      durationUnit: data.durationUnit,
      imageUrl: data.imageUrl,
      placeId: data.placeId,
      labels: data.labels || [],
      memo: data.memo,
      position: data.position,
      next: data.next,
      schedule: data.schedule,
    }
  },
}

export const EVENTS_SUB_COLLECTIONS = (plan: DocumentReference<Plan>) =>
  collection(plan, 'events').withConverter(converter)

type Props = {
  planDoc: DocumentReference<Plan> | null
}
export const CurrentEventsContextProvider: React.FC<Props> = ({
  children,
  planDoc,
}) => {
  const [events, setEvents] = React.useState<QuerySnapshot<Spot> | null>(null)

  React.useEffect(() => {
    if (!planDoc) {
      return
    }

    const q = query(EVENTS_SUB_COLLECTIONS(planDoc), orderBy('position'))
    const unsubscribe = onSnapshot(
      q,
      (result) => {
        setEvents(result)
      },
      (error) => {
        console.error(error)
        setEvents(null)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [planDoc])

  return (
    <CurrentEventsContext.Provider value={events}>
      {children}
    </CurrentEventsContext.Provider>
  )
}
