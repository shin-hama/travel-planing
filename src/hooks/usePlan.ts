import * as React from 'react'

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

export const usePlan = () => {
  const [user] = useAuthentication()
  const db = useFirestore()

  const plan = React.useContext(CurrentPlanContext)
  const setPlan = React.useContext(SetCurrentPlanContext)

  const savePlan = React.useCallback(
    async (newPlan: Omit<Plan, 'id'>) => {
      try {
        if (user) {
          const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
          const ref = await db.add(path, newPlan)
          setPlan({ ...newPlan, id: ref.id })
        } else {
          console.log('Current user is guest')
          setPlan({ ...newPlan, id: 'guest' })
        }
      } catch {
        console.error('fail to save plan')
      }
    },
    [db, setPlan, user]
  )

  return [plan, { savePlan }] as const
}
