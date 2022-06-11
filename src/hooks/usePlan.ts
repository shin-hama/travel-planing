import * as React from 'react'
import { DocumentReference, onSnapshot } from 'firebase/firestore'

import {
  PLANING_USERS_PLANS_COLLECTIONS,
  useFirestore,
} from './firebase/useFirestore'
import { Plan, SetCurrentPlanContext } from 'contexts/CurrentPlanProvider'
import { planConverter } from './usePlans'

export const usePlan = () => {
  const db = useFirestore()
  const setCurrentPlan = React.useContext(SetCurrentPlanContext)
  const [plan, setPlan] = React.useState<DocumentReference<Plan> | null>(null)

  React.useEffect(() => {
    if (!plan) {
      return
    }
    const unsubscribe = onSnapshot(plan, (doc) => {
      setCurrentPlan(doc.data() || null)
    })

    return () => {
      unsubscribe()
    }
  })

  const get = React.useCallback(
    async (userId: string, planId: string) => {
      try {
        const path = PLANING_USERS_PLANS_COLLECTIONS(userId)
        const result = await db.get(path, planId, planConverter)
        setPlan(result.ref)
      } catch (e) {
        console.error(e)
      }
    },
    [db]
  )

  return [plan, get] as const
}
