import * as React from 'react'

import {
  CurrentPlanContext,
  Plan,
  SetCurrentPlanContext,
} from 'contexts/CurrentPlanProvider'
import {
  PLANING_USERS_PLANS_COLLECTIONS,
  useFirestore,
} from './firebase/useFirestore'
import { useAuthentication } from './firebase/useAuthentication'

export interface PlanAPI {
  create: (newPlan: Plan) => Promise<string | undefined>
  clear: () => void
}

export const useTravelPlan = () => {
  const plan = React.useContext(CurrentPlanContext)
  const setPlan = React.useContext(SetCurrentPlanContext)

  const [user] = useAuthentication()
  const db = useFirestore()

  const actions = React.useMemo<PlanAPI>(() => {
    const a: PlanAPI = {
      create: async (newPlan: Plan): Promise<string | undefined> => {
        try {
          if (user) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            const ref = await db.add(path, newPlan)

            return ref.id
          }
        } catch (e) {
          console.error(e)
        }
      },
      clear: () => {
        setPlan(null)
      },
    }

    return a
  }, [db, setPlan, user])

  return [plan || null, actions] as const
}
