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
import { Spot } from 'contexts/CurrentPlanProvider'

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
  collection(schedule, 'events') as CollectionReference<Spot>

export const useEvents = (schedule: DocumentReference<Schedule>) => {
  const [events, setEvents] = React.useState<QuerySnapshot<Spot> | null>()

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
