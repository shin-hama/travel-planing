import * as React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

import PlansList from 'components/modules/PlansList'
import { useAuthentication } from 'hooks/firebase/useAuthentication'
import { usePlan } from 'hooks/usePlan'
import { Plan } from 'contexts/CurrentPlanProvider'
import { StepperHandlerContext } from './RoutePlanner'
import dayjs from 'dayjs'

const UserHome = () => {
  const [user] = useAuthentication()
  const [, actions] = usePlan()
  const [plans, setPlans] = React.useState<Array<Plan>>([])
  const [nextPlan, setNextPlan] = React.useState<Plan | null>(null)
  const setStep = React.useContext(StepperHandlerContext)

  React.useEffect(() => {
    if (user) {
      actions.fetch().then((results) => {
        setPlans(results || [])
      })
    } else {
      setPlans([])
    }
  }, [actions, user])

  const handleClick = () => {
    setStep('Config')
  }

  React.useEffect(() => {
    // 将来の旅行計画の中から、最も近い旅行を表示する
    const today = new Date()
    const sortedFeaturesDesc = plans
      .filter((plan) => plan.end > today)
      .sort((a, b) => dayjs(b.start).diff(a.start))
    setNextPlan(sortedFeaturesDesc.shift() || null)
  }, [plans])

  return (
    <>
      {nextPlan && (
        <Box style={{ height: '20%', backgroundColor: '#aaaaaa50' }}>
          <Typography>Next trip</Typography>
        </Box>
      )}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <PlansList plans={plans} />
      </Container>
      <Fab
        onClick={handleClick}
        color="primary"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}>
        <FontAwesomeIcon icon={faAdd} size="lg" />
      </Fab>
    </>
  )
}

export default UserHome
