import * as React from 'react'

import { useTravelPlan } from 'hooks/useTravelPlan'
import { useRouter } from 'hooks/useRouter'
import PlanView from 'components/layouts/PlanView'

const FeaturedPlaces = () => {
  const router = useRouter()
  const [plan] = useTravelPlan()

  React.useEffect(() => {
    if (!plan) {
      router.userHome(true)
    }
  }, [plan, router])

  return <PlanView />
}

export default FeaturedPlaces
