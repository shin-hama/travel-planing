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

const RouteViewer = () => {
  const directionService = useDirections()
  const selected = React.useContext(SelectedPrefectureContext)
  const [events] = useSelectSpots()

  const handleOptimize = async () => {
    const result = await directionService.search(
      selected.home.,
      events
        .filter(
          (event): event is SpotEvent => event.extendedProps.type === 'spot'
        )
        .map((spot) => spot.extendedProps.placeId)
    )
    console.log(result)
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
