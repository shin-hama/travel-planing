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
  delete: () => Promise<void>
  set: (id: string, newPlan: Plan) => void
  update: (updated: Partial<Plan>) => void
}

export const useTravelPlan = () => {
  const plan = React.useContext(CurrentPlanContext)
  const setPlan = React.useContext(SetCurrentPlanContext)

  const [user] = useAuthentication()
  const db = useFirestore()

  const planRef = React.useRef<Plan | null>(null)
  planRef.current = plan?.data || null

  const actions = React.useMemo<PlanAPI>(() => {
    const a: PlanAPI = {
      create: async (newPlan: Plan): Promise<string | undefined> => {
        try {
          if (user) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            const ref = await db.add(path, newPlan)

            actions.set(ref.id, newPlan)
            return ref.id
          } else {
            setPlan({ type: 'create', value: newPlan })
          }
        } catch (e) {
          console.error(e)
        }
      },
      clear: () => {
        setPlan({ type: 'clear' })
      },
      set: (id: string, newPlan: Plan) => {
        setPlan({ type: 'set', value: { id, data: newPlan } })
      },
      update: (updatedPlan: Partial<Plan>) => {
        try {
          // Guest user でも Plan が更新されるように、DB 周りとは隔離して更新する
          setPlan({ type: 'update', value: updatedPlan })
        } catch (e) {
          console.error(updatedPlan)
        }
      },
      delete: async () => {
        try {
          if (user && plan) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            await db.delete(path, plan.id)
            setPlan({ type: 'clear' })
          }
        } catch (e) {
          console.error(e)
        }
      },
    }

    return a
  }, [db, plan, setPlan, user])

  return [plan?.data || null, actions] as const
}
