import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import PlanEditor from 'components/modules/PlanEditor'
import { useDirections } from 'hooks/googlemaps/useDirections'
import { useSelectSpots } from 'hooks/useSelectSpots'
import { useConfirm } from 'hooks/useConfirm'

const RouteViewer = () => {
  const { loading } = useDirections()
  const { actions: eventsApi } = useSelectSpots()
  const confirm = useConfirm({ allowClose: false })

  const handleOptimize = async () => {
    try {
      try {
        await confirm(
          'Optimize your plan.\nWARNING: Current plan will be overwritten'
        )
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
            Your travel plan
          </Typography>
          <Button variant="contained" onClick={handleOptimize}>
            Optimize
          </Button>
        </Stack>
        <PlanEditor />
      </Container>
    </>
  )
}

export default RouteViewer
