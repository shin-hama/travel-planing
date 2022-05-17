import * as React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

import Layout from './Layout'
import PlanningLayout from 'components/layouts/PlaningLayout'
import { PlanningTabProvider } from 'contexts/PlannigTabProvider'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { useRouter } from 'hooks/useRouter'

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
    <PlanningTabProvider>
      <Layout title={plan.title} fixedHeader>
        <PlanningLayout />
      </Layout>
    </PlanningTabProvider>
  )
}

export default PlanLayout
