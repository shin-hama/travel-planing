import * as React from 'react'
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  SnapshotOptions,
} from 'firebase/firestore'

import {
  PLANING_USERS_PLANS_COLLECTIONS,
  useFirestore,
} from './firebase/useFirestore'
import { Plan } from 'contexts/CurrentPlanProvider'
import { useAuthentication } from './firebase/useAuthentication'

// Firestore data converter
export const planConverter: FirestoreDataConverter<Plan> = {
  toFirestore: (plan: Plan) => {
    return {
      ...plan,
      updatedAt: serverTimestamp(),
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ): Plan => {
    const data = snapshot.data(options)
    return {
      title: data.title,
      start: data.start?.toDate(), // Convert firestore timestamp to js Date.
      startTime: data.startTime?.toDate(), // Convert firestore timestamp to js Date.
      end: data.end?.toDate(),
      home: data.home,
      destination: data.destination,
      thumbnail: data.thumbnail || '',
      events:
        data.events?.map((event: DocumentData) => ({
          ...event,
          start: event.start?.toDate(),
          end: event.end?.toDate(),
        })) || [],
      routes: data.routes || [],
      lodging: data.lodging || undefined,
      belongings: data.belongings || [],
    }
  },
}

export const usePlans = () => {
  const db = useFirestore()
  const [user] = useAuthentication()
  const [plans, setPlans] = React.useState<QuerySnapshot<Plan> | null>(null)

  React.useEffect(() => {
    if (!user) {
      return
    }
    const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
    db.getDocuments(path, planConverter).then((result) => {
      setPlans(result)
    })
  }, [db, user])

  const actions = React.useMemo(() => {
    const a = {
      get: async (userId: string, planId: string) => {
        try {
          const path = PLANING_USERS_PLANS_COLLECTIONS(userId)
          const result = await db.get(path, planId, planConverter)

          return result.ref
        } catch (e) {
          console.error(e)
        }
      },
    }

    return a
  }, [db])

  return [plans, actions] as const
}
