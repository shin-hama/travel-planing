import * as React from 'react'

import {
  collection,
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  SnapshotOptions,
} from 'firebase/firestore'

import { Schedule } from './useSchedules'
import { Route, Spot } from 'contexts/CurrentPlanProvider'

type Next = Route & {
  lat: number
  lng: number
}

export type SpotDocument = Spot & {
  next: Next
}

const converter: FirestoreDataConverter<SpotDocument> = {
  toFirestore: (spot: SpotDocument) => {
    return {
      ...spot,
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): SpotDocument => {
    const data = snapshot.data(options)
    return {
      id: data.spot,
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
    }
  },
}

export const EVENTS_SUB_COLLECTIONS = (schedule: DocumentReference<Schedule>) =>
  collection(schedule, 'events') as CollectionReference<SpotDocument>

export const useEvents = (schedule: DocumentReference<Schedule>) => {
  const [events, setEvents] =
    React.useState<QuerySnapshot<SpotDocument> | null>()

  React.useEffect(() => {
    getDocs(
      query(
        EVENTS_SUB_COLLECTIONS(schedule).withConverter(converter),
        orderBy('position')
      )
    )
      .then((result) => {
        setEvents(result)
      })
      .catch(() => {
        setEvents(null)
      })
  }, [schedule])

  return [events] as const
}
