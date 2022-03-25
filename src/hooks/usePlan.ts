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
import { Plan, PlanDB } from 'contexts/CurrentPlanProvider'

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
      title: data.title,
      start: data.start?.toDate(), // Convert firestore timestamp to js Date.
      startTime: data.startTime?.toDate(), // Convert firestore timestamp to js Date.
      end: data.end?.toDate(),
      home: data.home,
      destination: data.destination,
      thumbnail: data.thumbnail || '',
      waypoints: data.waypoints || [],
      routes: data.routes || [],
      events:
        data.events?.map((event: DocumentData) => ({
          ...event,
          start: event.start?.toDate(),
          end: event.end?.toDate(),
        })) || [],
    }
  },
}

export const usePlans = () => {
  const [user] = useAuthentication()
  const db = useFirestore()

  const actions = React.useMemo(() => {
    const a = {
      fetch: async (): Promise<Array<PlanDB>> => {
        try {
          if (user) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            const results = await db.getDocuments(path, planConverter)

            return results.docs.map((result) => ({
              id: result.id,
              data: result.data(),
            }))
          }
        } catch (e) {
          console.error(e)
        }
        return []
      },
    }

    return a
  }, [db, user])

  return actions
}
