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
      thumbnail: data.thumbnail || '',
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
            setPlan({ type: 'set', value: { ...newPlan, id: ref.id } })
          } else {
            console.log('Current user is guest')
            setPlan({ type: 'set', value: { ...newPlan, id: 'guest' } })
          }
        } catch {
          console.error(`fail to save plan: ${JSON.stringify(newPlan)}`)
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
          }

          // Guest user でも Plan が更新されるように、DB 周りとは隔離して更新する
          setPlan({ type: 'update', value: updatedPlan })
        } catch (e) {
          console.error(updatedPlan)
        }
      },
      set: (target: Plan) => {
        setPlan({ type: 'set', value: target })
      },
    }

    return a
  }, [db, plan, setPlan, user])

  return [plan, actions] as const
}
