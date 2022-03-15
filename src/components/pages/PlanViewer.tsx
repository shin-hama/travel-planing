import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Fab from '@mui/material/Fab'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

import EventsScheduler from 'components/modules/EventsScheduler'
import { useDirections } from 'hooks/googlemaps/useDirections'
import { usePlanEvents } from 'hooks/usePlanEvents'
import { useConfirm } from 'hooks/useConfirm'
import { usePlan } from 'hooks/usePlan'
import { StepperHandlerContext } from './PlaningMain'
import { Box } from '@mui/material'

const PlanViewer = () => {
  const { loading } = useDirections()
  const [, eventsApi] = usePlanEvents()
  const confirm = useConfirm()
  const [plan] = usePlan()

  const setStep = React.useContext(StepperHandlerContext)

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
      }))
      eventsApi.generateRoute(waypoints)
    } catch (e) {
      alert(e)
    }
  }

  if (loading) {
    return (
      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
    )
  }

  if (!plan) {
    throw new Error('Plan is not selected')
  }

  return (
    <>
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
          onClick={() => setStep('Map')}
          color="primary"
          sx={{
            position: 'fixed',
            right: 16,
            bottom: 16,
          }}>
          <FontAwesomeIcon icon={faAdd} size="lg" />
        </Fab>
      </Container>
    </>
  )
}

export default PlanViewer
