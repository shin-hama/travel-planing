import * as React from 'react'
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  serverTimestamp,
  SnapshotOptions,
} from 'firebase/firestore'

import {
  PLANING_USERS_PLANS_COLLECTIONS,
  useFirestore,
} from './firebase/useFirestore'
import { Plan, PlanDB } from 'contexts/CurrentPlanProvider'

// Firestore data converter
const planConverter: FirestoreDataConverter<Plan> = {
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
          date: event.date?.toDate(),
        })) || [],
      lodging: data.lodging || undefined,
      belongings: data.belongings || [],
    }
  },
}

export const usePlans = () => {
  const db = useFirestore()

  const actions = React.useMemo(() => {
    const a = {
      save: async (userId: string, plan: PlanDB): Promise<PlanDB> => {
        console.log('save plan')
        const path = PLANING_USERS_PLANS_COLLECTIONS(userId)
        if (plan.id !== '' && userId) {
          await db.set(path, plan.id, plan.data, planConverter)
          return plan
        } else {
          const ref = await db.add(path, plan.data)
          return { id: ref.id, data: plan.data }
        }
      },
      fetch: async (userId: string): Promise<Array<PlanDB>> => {
        try {
          const path = PLANING_USERS_PLANS_COLLECTIONS(userId)
          const results = await db.getDocuments(path, planConverter)

          return results.docs.map((result) => ({
            id: result.id,
            data: result.data(),
          }))
        } catch (e) {
          console.error(e)
        }
        return []
      },
      get: async (userId: string, planId: string) => {
        try {
          const path = PLANING_USERS_PLANS_COLLECTIONS(userId)
          const result = await db.get(path, planId, planConverter)

          return result.data()
        } catch (e) {
          console.error(e)
        }
      },
    }

    return a
  }, [db])

  return actions
}
