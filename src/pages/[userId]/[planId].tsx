import * as React from 'react'

import PlanLayout from 'components/layouts/PlanLayout'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { usePlans } from 'hooks/usePlans'
import { useRouter } from 'hooks/useRouter'

const PlanPage = () => {
  const router = useRouter()
  const { userId, planId } = router.query
  const { get: getPlan } = usePlans()

  const [, planApi] = useTravelPlan()

  React.useEffect(() => {
    if (typeof planId === 'string' && typeof userId === 'string') {
      getPlan(userId, planId)
        .then((target) => {
          if (!target) {
            console.error(`Plan is not exist. ID: ${planId}`)
            // router.userHome(true)
            return
          }
          planApi.set(planId, target)
        })
        .catch(() => {
          router.userHome(true)
        })
    }

    return () => {
      planApi.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, userId])

  return <PlanLayout />
}

export default PlanPage
