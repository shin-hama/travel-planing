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

import { Schedule } from 'hooks/useSchedules'
import { Plan } from './CurrentPlanProvider'

export const CurrentSchedulesContext =
  React.createContext<QuerySnapshot<Schedule> | null>(null)

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
      dept: data.dept,
      position: data.position,
      createdAt: data.createdAt?.toDate(),
    }
  },
}

export const SCHEDULES_SUB_COLLECTIONS = (plan: DocumentReference<Plan>) =>
  collection(plan, 'schedules').withConverter(converter)

type Props = {
  planRef: DocumentReference<Plan> | null
}
export const CurrentSchedulesContextProvider: React.FC<Props> = ({
  children,
  planRef,
}) => {
  const [schedules, setSchedules] =
    React.useState<QuerySnapshot<Schedule> | null>(null)

  React.useEffect(() => {
    if (!planRef) {
      return
    }

    const q = query(SCHEDULES_SUB_COLLECTIONS(planRef), orderBy('position'))
    const unsubscribe = onSnapshot(
      q,
      (result) => {
        setSchedules(result)
      },
      (error) => {
        console.error(error)
        setSchedules(null)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [planRef])

  return (
    <CurrentSchedulesContext.Provider value={schedules}>
      {children}
    </CurrentSchedulesContext.Provider>
  )
}
