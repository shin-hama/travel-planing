import * as React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

import Layout from './Layout'
import PlanningPage from 'components/layouts/PlanningPage'
import { PlanningTabProvider } from 'contexts/PlanningTabProvider'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { useRouter } from 'hooks/useRouter'
import { PlanViewConfigProvider } from 'contexts/PlanViewConfigProvider'

const PlanLayout = () => {
  const router = useRouter()
  const [plan] = useTravelPlan()

  if (!plan) {
    return (
      <Layout title="Not Found">
        <Stack alignItems="center" py={6} spacing={3}>
          <Typography variant="h2">Plan is not exist</Typography>
          <Link href={router.home}>Back to home</Link>
        </Stack>
      </Layout>
    )
  }

  return (
    <PlanViewConfigProvider>
      <PlanningTabProvider>
        <Layout title={plan.title} fixedHeader>
          <PlanningPage />
        </Layout>
      </PlanningTabProvider>
    </PlanViewConfigProvider>
  )
}

export default PlanLayout
