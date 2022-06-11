import * as React from 'react'

import {
  DocumentReference,
  FirestoreDataConverter,
  onSnapshot,
  QueryDocumentSnapshot,
  SnapshotOptions,
  updateDoc,
} from 'firebase/firestore'

import {
  DocumentBase,
  PLANING_USERS_PLANS_COLLECTIONS,
} from './firebase/useFirestore'
import { Spot } from 'contexts/CurrentPlanProvider'

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

export const useSchedule = (ref: DocumentReference<Schedule>) => {
  const [schedule, setSchedule] = React.useState<Schedule | null>(null)

  React.useEffect(() => {
    const unsubscribe = onSnapshot(ref.withConverter(converter), (doc) => {
      console.log(doc)
      console.log(doc.data())
      setSchedule(doc.data() || null)
    })

    return () => {
      unsubscribe()
    }
  }, [ref])

  const actions = React.useMemo<DocActions<Schedule>>(() => {
    const a: DocActions<Schedule> = {
      update: async (updated) => {
        updateDoc(ref, updated)
      },
    }

    return a
  }, [ref])

  return [schedule, actions] as const
}
