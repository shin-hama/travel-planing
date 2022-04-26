import * as React from 'react'

import PlanView from 'components/layouts/PlanView'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { usePlans } from 'hooks/usePlan'
import { useRouter } from 'hooks/useRouter'

const PlanPage = () => {
  const router = useRouter()
  const { userId, planId } = router.query
  const { get: getPlan } = usePlans()

  const [plan, planApi] = useTravelPlan()

  React.useEffect(() => {
    const func = async () => {
      if (typeof planId === 'string' && typeof userId === 'string') {
        getPlan(userId, planId)
          .then((target) => {
            if (!target) {
              console.error(`Plan is not exist. ID: ${planId}`)
              router.userHome(true)
              return
            }
            planApi.set(planId, target)
          })
          .catch(() => {
            router.userHome(true)
          })
      }
    }

    func()

    return () => {
      planApi.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, userId])

  if (!plan) {
    return <></>
  }

  return <PlanView />
}

export default PlanPage
