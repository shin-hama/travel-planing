import * as React from 'react'

import PlanLayout from 'components/layouts/PlanLayout'
import { usePlan } from 'hooks/usePlan'
import { useRouter } from 'hooks/useRouter'

const PlanPage = () => {
  const router = useRouter()
  const { userId, planId } = router.query
  const [plan, fetch] = usePlan()

  React.useEffect(() => {
    if (typeof userId === 'string' && typeof planId === 'string') {
      fetch(userId, planId)
    }
  }, [fetch, planId, userId])

  if (!plan) {
    return <>Not Found</>
  }

  return <PlanLayout plan={plan} />
}

export default PlanPage
