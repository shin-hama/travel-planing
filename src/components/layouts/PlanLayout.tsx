import * as React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

import Layout from './Layout'
import PlanningPage from 'components/layouts/PlanningPage'
import { PlanningTabProvider } from 'contexts/PlanningTabProvider' 
import { useRouter } from 'hooks/useRouter'
import { PlanViewConfigProvider } from 'contexts/PlanViewConfigProvider'
import { useDocument } from 'hooks/firebase/useDocument'
import { planConverter } from 'hooks/usePlans'
import { DocumentReference } from 'firebase/firestore'
import { Plan } from 'contexts/CurrentPlanProvider'

type Props = {
  plan: DocumentReference<Plan>
}
const PlanLayout: React.FC<Props> = ({ plan: planRef }) => {
  const router = useRouter()
  const [plan] = useDocument(planRef, planConverter)

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
