import * as React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

import PlanningLayout from 'components/layouts/PlaningLayout'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { useRouter } from 'hooks/useRouter'

const PlanLayout = () => {
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

  return <PlanningLayout />
}

export default PlanLayout
