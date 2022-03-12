import * as React from 'react'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import { StepperHandlerContext } from './RoutePlanner'
import SpotsCandidates from '../modules/SpotsCandidates'
import SpotsMap from '../modules/SpotsMap'
import { useSelectSpots } from 'hooks/useSelectSpots'
import { useSelectedSpots } from 'hooks/useSelectedSpots'

const FeaturedPlaces = () => {
  const [open, setOpen] = React.useState(false)
  const setStep = React.useContext(StepperHandlerContext)
  const { events, actions } = useSelectSpots()
  const [spots, spotsActions] = useSelectedSpots()

  React.useEffect(() => {
    spotsActions.init(events)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClickNext = async () => {
    await actions.generateRoute(spots)
    setStep('Schedule')
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <SpotsMap />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline">
          <Badge badgeContent={spots.length} color="primary">
            <Button variant="text" onClick={handleOpen}>
              Spots List
            </Button>
          </Badge>
          <Box
            sx={{
              width: 30,
              height: 6,
              backgroundColor: (theme) => theme.palette.grey[300],
              borderRadius: 3,
            }}
          />
          <Button variant="contained" onClick={handleClickNext}>
            Get Route
          </Button>
        </Stack>
      </Box>
      <SpotsCandidates
        open={open}
        placeIds={spots.map((spot) => spot.placeId)}
        onOpen={handleOpen}
        onClose={handleClose}
      />
    </>
  )
}

export default FeaturedPlaces
