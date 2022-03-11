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

  const create = React.useCallback(
    async (newPlan: Omit<Plan, 'id'>) => {
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
    [db, setPlan, user]
  )

  const update = React.useCallback(
    async (updatedPlan: Partial<Plan>) => {
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
    [db, plan, setPlan, user]
  )

  return [plan, { create, update }] as const
}
