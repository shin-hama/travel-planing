import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import PlanEditor from './organisms/PlanEditor'
import { useDirections } from 'hooks/useDirections'
import { useSelectSpots } from 'hooks/useSelectSpots'
import { SpotEvent } from 'contexts/SelectedPlacesProvider'
import { SelectedPrefectureContext } from 'contexts/SelectedPrefectureProvider'
import { useConfirm } from 'hooks/useConfirm'

const RouteViewer = () => {
  const { actions: directionService, loading } = useDirections()
  const selected = React.useContext(SelectedPrefectureContext)
  const { events, actions: eventsApi } = useSelectSpots()
  const confirm = useConfirm({ allowClose: false })

  React.useEffect(() => {
    console.log(loading)
  }, [loading])

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
      const waypoints = events.filter(
        (e): e is SpotEvent => e.extendedProps.type === 'spot'
      )

      const result = await directionService.search({
        origin: {
          placeId: selected.home?.place_id || selected.destination?.place_id,
        },
        destination: {
          placeId: selected.home?.place_id || selected.destination?.place_id,
        },
        waypoints: waypoints.map((spot) => ({
          location: {
            placeId: spot.extendedProps.placeId,
          },
        })),
        travelMode: google.maps.TravelMode.DRIVING,
      })

      // Event をクリアしてから、最適化された順番で再登録する
      eventsApi.init()
      for (const i of result.routes[0].waypoint_order) {
        await eventsApi.add({
          placeId: waypoints[i].extendedProps.placeId,
          imageUrl: waypoints[i].extendedProps.imageUrl,
        })
      }
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
