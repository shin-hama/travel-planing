import * as React from 'react'
import Stack from '@mui/material/Stack'

import SpotsMap from 'components/modules/SpotsMap'
import PlanningLayout from 'components/layouts/PlaningLayout'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { useRouter } from 'hooks/useRouter'
import MapToolbar from 'components/modules/MapToolbar'

const FeaturedPlaces = () => {
  const router = useRouter()
  const [plan] = useTravelPlan()

  React.useEffect(() => {
    if (!plan) {
      router.userHome(true)
    }
  }, [plan, router])

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

export default FeaturedPlaces
