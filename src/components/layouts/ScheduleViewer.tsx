import * as React from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import Fab from '@mui/material/Fab'
import Snackbar from '@mui/material/Snackbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons'

import PlanningLayout from 'components/layouts/PlaningLayout'
import Scheduler from 'components/modules/Scheduler'
import SchedulerHeader from 'components/modules/SchedulerHeader'
import { useRouter } from 'hooks/useRouter'
import { useTravelPlan } from 'hooks/useTravelPlan'

type Props = {
  open: boolean
  onClose: () => void
}
const ScheduleViewer: React.FC<Props> = ({ open, onClose }) => {
  const router = useRouter()
  const [plan, planApi] = useTravelPlan()

  React.useEffect(() => {
    if (!plan) {
      router.userHome(true)
    }
  }, [plan, router])

  if (!plan) {
    return <></>
  }

  return (
    <Drawer open={open} anchor="bottom" onClose={onClose}>
      <PlanningLayout>
        <Container
          maxWidth="md"
          sx={{
            display: 'flex',
            flexFlow: 'column',
            height: '100%',
          }}>
          <SchedulerHeader />
          <Box sx={{ height: '100%', zIndex: 0 }}>
            <Scheduler plan={plan} planApi={planApi} />
          </Box>
          <Fab
            onClick={onClose}
            color="primary"
            sx={{
              position: 'fixed',
              right: 16,
              bottom: 16,
            }}>
            <FontAwesomeIcon icon={faMapLocationDot} size="lg" />
          </Fab>
        </Container>
      </PlanningLayout>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={plan.waypoints?.length === 0}
        autoHideDuration={6000}>
        <Alert severity={'info'}>地図上で行きたい場所を選んでください。</Alert>
      </Snackbar>
    </Drawer>
  )
}

export default ScheduleViewer
