import * as React from 'react'
import Button from '@mui/material/Button'
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
  const directionService = useDirections()
  const selected = React.useContext(SelectedPrefectureContext)
  const [events, eventsApi] = useSelectSpots()
  const confirm = useConfirm({ allowClose: false })

  const handleOptimize = async () => {
    if (selected.home) {
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

        const result = await directionService.search(
          selected.home.place_id,
          waypoints.map((spot) => spot.extendedProps.placeId)
        )

        // Event をクリアしてから、最適化された順番で再登録する
        eventsApi.clear()
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
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexFlow: 'column',
        height: '100%',
      }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" component="h2">
          Your travel plan
        </Typography>
        <Button
          disabled={events.length < 2}
          variant="contained"
          onClick={handleOptimize}>
          Optimize
        </Button>
      </Stack>
      <PlanEditor />
    </Container>
  )
}

export default RouteViewer
