import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Fab from '@mui/material/Fab'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

import PlanningLayout from 'components/layouts/PlaningLayout'
import PlansList from 'components/modules/PlansList'
import TravelPlanCard from 'components/modules/TravelPlanCard'
import { PlanDB } from 'contexts/CurrentPlanProvider'
import { useAuthentication } from 'hooks/firebase/useAuthentication'
import { usePlans } from 'hooks/usePlan'
import { useConfirm } from 'hooks/useConfirm'

const UserHome = () => {
  const router = useRouter()
  const [user] = useAuthentication()
  const actions = usePlans()
  const confirm = useConfirm()
  const [plans, setPlans] = React.useState<Array<PlanDB>>([])
  const [nextPlan, setNextPlan] = React.useState<PlanDB | null>(null)

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
      .filter(({ data }) => data.end > today)
      .sort((a, b) => dayjs(b.data.start).diff(a.data.start))
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
    router.push('new')
  }

  return (
    <PlanningLayout>
      {nextPlan && (
        <Box style={{ height: '40%', backgroundColor: '#aaaaaa50' }}>
          <TravelPlanCard plan={nextPlan} />
        </Box>
      )}
      <Container maxWidth="lg" sx={{ my: 4 }}>
        {plans.length > 0 ? (
          <Stack spacing={4} alignItems="center">
            <PlansList plans={plans} />
            <Typography variant="h6">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.google.com/forms/d/e/1FAIpQLSf3QzB_-Gfv0uwRh0_ixEiAyTtmIcgGM6P2HtTlDJIf7YrmHA/viewform?usp=sf_link">
                アンケートにご協力ください
              </a>
            </Typography>
          </Stack>
        ) : (
          <Box display="flex" justifyContent="center">
            <Button variant="contained" onClick={handleClick}>
              Plan Your Travel
            </Button>
          </Box>
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
