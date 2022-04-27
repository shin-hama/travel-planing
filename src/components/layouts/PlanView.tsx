import * as React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

import SpotsMap from 'components/modules/SpotsMap'
import PlanningLayout from 'components/layouts/PlaningLayout'
import MapToolbar from 'components/modules/MapToolbar'
import { MapLayerProvider } from 'contexts/MapLayerModeProvider'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { useRouter } from 'hooks/useRouter'

const PlanView = () => {
  const router = useRouter()
  const [plan] = useTravelPlan()

  if (!plan) {
    return (
      <PlanningLayout>
        <Stack alignItems="center" py={6} spacing={3}>
          <Typography variant="h2">Plan is not exist</Typography>
          <Link href={router.home}>Back to home</Link>
        </Stack>
      </PlanningLayout>
    )
  }

  return (
    <PlanningLayout>
      <Stack
        sx={{
          width: '100%',
          height: '100%',
        }}>
        <MapLayerProvider>
          <SpotsMap />
          <MapToolbar />
        </MapLayerProvider>
      </Stack>
    </PlanningLayout>
  )
}

export default PlanView
