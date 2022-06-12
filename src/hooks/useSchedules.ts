import * as React from 'react'

import {
  collection,
  FirestoreDataConverter,
  getDocs,
  QueryDocumentSnapshot,
  QuerySnapshot,
  SnapshotOptions,
} from 'firebase/firestore'

import {
  DocumentBase,
  PLANING_USERS_PLANS_COLLECTIONS,
} from './firebase/useFirestore'
import { CurrentPlanRefContext, Spot } from 'contexts/CurrentPlanProvider'

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

type Schedule = DocumentBase & {
  start: Date
  end: Date
  spots: Array<Spot>
}

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
      spots: data.spots || [],
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
    getDocs(collection(planRef, 'schedules').withConverter(converter))
      .then((result) => {
        setSchedules(result)
      })
      .catch(() => {
        setSchedules(null)
      })
  }, [planRef])

  return schedules
}
