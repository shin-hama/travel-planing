import * as React from 'react'
import Stack from '@mui/material/Stack'

import SpotsMap from 'components/modules/SpotsMap'
import PlanningLayout from 'components/layouts/PlaningLayout'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { usePlans } from 'hooks/usePlan'
import { useRouter } from 'hooks/useRouter'
import MapToolbar from 'components/modules/MapToolbar'

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
  }, [planId, userId])

  if (!plan) {
    return <></>
  }

  return (
    <PlanningLayout>
      <Stack
        sx={{
          width: '100%',
          height: '100%',
        }}>
        <SpotsMap />
        <MapToolbar />
      </Stack>
    </PlanningLayout>
  )
}

export default PlanPage
