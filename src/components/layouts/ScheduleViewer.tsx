import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import Fab from '@mui/material/Fab'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons'

import { useRouter } from 'next/router'

import EventsScheduler from 'components/modules/EventsScheduler'
import PlanningLayout from 'components/layouts/PlaningLayout'
import { useDirections } from 'hooks/googlemaps/useDirections'
import { usePlanEvents } from 'hooks/usePlanEvents'
import { useConfirm } from 'hooks/useConfirm'
import { usePlan } from 'hooks/usePlan'

type Props = {
  open: boolean
  onClose: () => void
}
const ScheduleViewer: React.FC<Props> = ({ open, onClose }) => {
  const router = useRouter()
  const { loading } = useDirections()
  const [, eventsApi] = usePlanEvents()
  const confirm = useConfirm()
  const [plan] = usePlan()

  const handleOptimize = async () => {
    try {
      try {
        await confirm({
          allowClose: false,
          description:
            'Optimize your plan.\nWARNING: Current plan will be overwritten',
        })
      } catch {
        // when cancel
        return
      }
      const waypoints = eventsApi.getDestinations().map((event) => ({
        placeId: event.extendedProps.placeId,
        imageUrl: event.extendedProps.imageUrl,
        name: event.title,
      }))
      eventsApi.generateRoute(waypoints)
    } catch (e) {
      alert(e)
    }
  }

  React.useEffect(() => {
    if (!plan) {
      router.replace('/')
    }
  }, [plan, router])

  if (loading) {
    return (
      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
    )
  }

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
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="h4" component="h2">
              {plan.title}
            </Typography>
            <Button variant="contained" onClick={handleOptimize}>
              Optimize
            </Button>
          </Stack>
          <Box sx={{ height: '100%', zIndex: 0 }}>
            <EventsScheduler />
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
    </Drawer>
  )
}

export default ScheduleViewer
