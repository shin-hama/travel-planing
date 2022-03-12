import * as React from 'react'
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore'

import {
  PLANING_USERS_PLANS_COLLECTIONS,
  useFirestore,
} from './firebase/useFirestore'
import { useAuthentication } from './firebase/useAuthentication'
import {
  CurrentPlanContext,
  Plan,
  SetCurrentPlanContext,
} from 'contexts/CurrentPlanProvider'

// Firestore data converter
const planConverter: FirestoreDataConverter<Plan> = {
  toFirestore: (plan: Plan) => {
    return { ...plan }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ): Plan => {
    const data = snapshot.data(options)
    return {
      id: snapshot.id,
      title: data.title,
      start: data.start?.toDate(), // Convert firestore timestamp to js Date.
      end: data.end?.toDate(),
      home: data.home,
      destination: data.destination,
      events:
        data.events?.map((event: DocumentData) => ({
          ...event,
          start: event.start?.toDate(),
          end: event.end?.toDate(),
        })) || [],
    }
  },
}

export const usePlan = () => {
  const [user] = useAuthentication()
  const db = useFirestore()

  const plan = React.useContext(CurrentPlanContext)
  const setPlan = React.useContext(SetCurrentPlanContext)

  const actions = React.useMemo(() => {
    const a = {
      create: async (newPlan: Omit<Plan, 'id'>) => {
        try {
          if (user) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            const ref = await db.add(path, newPlan)
            setPlan({ type: 'create', value: { ...newPlan, id: ref.id } })
          } else {
            console.log('Current user is guest')
            setPlan({ type: 'create', value: { ...newPlan, id: 'guest' } })
          }
        } catch {
          console.error('fail to save plan')
        }
      },
      fetch: async () => {
        try {
          if (user) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            const results = await db.getDocuments(path, planConverter)

            return results.docs.map((result) => result.data())
          }
        } catch (e) {
          console.error(e)
        }
      },
      update: async (updatedPlan: Partial<Plan>) => {
        try {
          if (user && plan) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            await db.set(path, plan.id, updatedPlan)
            setPlan({ type: 'update', value: updatedPlan })
          }
        } catch (e) {
          console.error(e)
        }
      },
    }

    return a
  }, [db, plan, setPlan, user])

  return [plan, actions] as const
}
