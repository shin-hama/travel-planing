import * as React from 'react'

import {
  addDoc,
  collection,
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
  getDocs,
  increment,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  SnapshotOptions,
  updateDoc,
  where,
} from 'firebase/firestore'

import {
  DocumentBase,
  PLANING_USERS_PLANS_COLLECTIONS,
} from './firebase/useFirestore'
import { CurrentPlanRefContext, Spot } from 'contexts/CurrentPlanProvider'

export type SpotDTO = Pick<Spot, 'name' | 'placeId' | 'lat' | 'lng'> & {
  id?: string | null
}

/**
 * @param {string} userId - target user id
 * @param {string} planId - target plan id
 * @returns {string} path - planing/v1/users/${userId}/plans/${planId}/schedules
 */
export const SCHEDULE_COLLECTIONS = (userId: string, planId: string): string =>
  `${PLANING_USERS_PLANS_COLLECTIONS(userId)}/${planId}/schedules`

export type DocActions<T> = {
  update: (updated: Partial<T>) => void
}

export type Schedule = DocumentBase & {
  start: Date
  end: Date
  size: number
}

export type ScheduleDTO = Pick<Schedule, 'start' | 'end' | 'size'>

const EVENTS_SUB_COLLECTIONS = (schedule: DocumentReference<Schedule>) =>
  collection(schedule, 'events') as CollectionReference<Spot>

// Firestore data converter
const converter: FirestoreDataConverter<Schedule> = {
  toFirestore: (schedule: Schedule) => {
    return {
      ...schedule,
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Schedule => {
    const data = snapshot.data(options)
    return {
      start: data.start?.toDate(), // Convert firestore timestamp to js Date.
      end: data.end?.toDate(),
      size: data.size || 0,
      createdAt: data.createdAt?.toDate(),
    }
  },
}

export const useSchedules = () => {
  const planRef = React.useContext(CurrentPlanRefContext)
  const [schedules, setSchedules] =
    React.useState<QuerySnapshot<Schedule> | null>()

  React.useEffect(() => {
    if (!planRef) {
      return
    }
    getDocs(
      query(
        collection(planRef, 'schedules').withConverter(converter),
        orderBy('start')
      )
    )
      .then((result) => {
        setSchedules(result)
      })
      .catch(() => {
        setSchedules(null)
      })
  }, [planRef])

  const actions = React.useMemo(() => {
    const a = {
      addSpot: async (newSpot: SpotDTO, day: number) => {
        if (schedules && day < schedules.size) {
          const target = schedules.docs[day]
          const size = (target.get('size') as number) || 0
          const spot: Spot = {
            ...newSpot,
            id: newSpot.id || '',
            duration: 60,
            durationUnit: 'minute',
            position: 1000 * (size + 1),
            imageUrl: '',
          }
          const spotDoc = await addDoc<Spot>(
            EVENTS_SUB_COLLECTIONS(target.ref),
            spot
          )

          updateDoc(target.ref, { size: increment(1) })
          return spotDoc
        }
      },
      findSpots: async (placeId: string, day: number) => {
        if (schedules && placeId && day < schedules.size) {
          const target = schedules.docs[day]
          const q = query(
            EVENTS_SUB_COLLECTIONS(target.ref),
            where('placeId', '==', placeId)
          )
          const result = await getDocs(q)
          if (result.empty) {
            return null
          } else {
            return result.docs.map((doc) => doc.ref)
          }
        }

        return null
      },
    }

    return a
  }, [schedules])

  return [schedules, actions] as const
}
