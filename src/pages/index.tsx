import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

import PlansList from 'components/modules/PlansList'
import { Plan } from 'contexts/CurrentPlanProvider'
import { useAuthentication } from 'hooks/firebase/useAuthentication'
import { usePlan } from 'hooks/usePlan'
import { useConfirm } from 'hooks/useConfirm'
import PlanningLayout from 'components/pages/PlaningLayout'

const UserHome = () => {
  const router = useRouter()
  const [user] = useAuthentication()
  const [, actions] = usePlan()
  const [plans, setPlans] = React.useState<Array<Plan>>([])
  const [nextPlan, setNextPlan] = React.useState<Plan | null>(null)
  const confirm = useConfirm()

  React.useEffect(() => {
    if (user) {
      actions.fetch().then((results) => {
        setPlans(results || [])
      })
    } else {
      setPlans([])
    }
  }, [actions, user])

  React.useEffect(() => {
    // 将来の旅行計画の中から、最も近い旅行を表示する
    const today = new Date()
    const sortedFeaturesDesc = plans
      .filter((plan) => plan.end > today)
      .sort((a, b) => dayjs(b.start).diff(a.start))
    setNextPlan(sortedFeaturesDesc.shift() || null)
  }, [plans])

  const handleClick = async () => {
    if (!user) {
      try {
        await confirm({
          title: 'Create Plan?',
          description:
            'NOTE: You are a guest user, you cannot save plan. Please create account or login if you want to save.',
          allowClose: true,
        })
      } catch {}
    }
    router.push('Config')
  }

  return (
    <PlanningLayout>
      {nextPlan && (
        <Box style={{ height: '20%', backgroundColor: '#aaaaaa50' }}>
          <Typography>Next trip</Typography>
        </Box>
      )}
      <Container
        maxWidth="lg"
        sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
        {plans.length > 0 ? (
          <PlansList plans={plans} />
        ) : (
          <Button variant="contained" onClick={handleClick}>
            Plan Your Travel
          </Button>
        )}
      </Container>
      <Fab
        onClick={handleClick}
        color="primary"
        sx={{
          position: 'fixed',
          right: 16,
          bottom: 16,
        }}>
        <FontAwesomeIcon icon={faAdd} size="lg" />
      </Fab>
    </PlanningLayout>
  )
}

export default UserHome
