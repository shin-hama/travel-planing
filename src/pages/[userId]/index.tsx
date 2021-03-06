import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Fab from '@mui/material/Fab'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

import Layout from 'components/layouts/Layout'
import PlansList from 'components/modules/PlansList'
import { useAuthentication } from 'hooks/firebase/useAuthentication'
import { usePlans } from 'hooks/usePlans'
import { useRouter } from 'hooks/useRouter'
import { visuallyHidden } from '@mui/utils'

const TITLE = 'Home'

const UserHome = () => {
  const router = useRouter()
  const { userId } = router.query

  const [user] = useAuthentication()
  const [plans] = usePlans()
  // const [nextPlan, setNextPlan] = React.useState<PlanDB | null>(null)

  // React.useEffect(() => {
  //   // 将来の旅行計画の中から、最も近い旅行を表示する
  //   const today = new Date()
  //   const sortedFeaturesDesc = plans
  //     .filter(({ data }) => data.end > today)
  //     .sort((a, b) => dayjs(b.data.start).diff(a.data.start))
  //   setNextPlan(sortedFeaturesDesc.shift() || null)
  // }, [plans])

  const handleClick = async () => {
    console.log('test')
    router.push('new')
  }

  if (user?.uid !== userId) {
    return (
      <Layout title={TITLE}>
        <Box display="flex" justifyContent="center" py={5}>
          <Typography>非公開リストです</Typography>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout title={TITLE}>
      {/* {nextPlan && (
        <Box style={{ height: '40%', backgroundColor: '#aaaaaa50' }}>
          <TravelPlanCard plan={nextPlan} />
        </Box>
      )} */}
      <Container maxWidth="lg" sx={{ my: 4 }}>
        {plans?.empty === false ? (
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
      <Box sx={user?.uid !== userId ? visuallyHidden : undefined}>
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
      </Box>
    </Layout>
  )
}

export default UserHome
