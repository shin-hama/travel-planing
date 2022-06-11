import * as React from 'react'

import PlanLayout from 'components/layouts/PlanLayout'
import { CurrentPlanContextProvider } from 'contexts/CurrentPlanProvider'
import { MapPropsProvider } from 'contexts/MapPropsProvider'
import { useRouter } from 'hooks/useRouter'

const PlanPage = () => {
  const router = useRouter()
  const { userId, planId } = router.query

  if (typeof userId === 'string' && typeof planId === 'string') {
    return (
      <CurrentPlanContextProvider query={{ userId, planId }}>
        <MapPropsProvider>
          <PlanLayout />
        </MapPropsProvider>
      </CurrentPlanContextProvider>
    )
  }

  return <>Not Found</>
}

export default PlanPage
