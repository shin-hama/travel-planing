import * as React from 'react'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import { SelectedPlacesContext } from 'contexts/SelectedPlacesProvider'
import { StepperHandlerContext } from './RoutePlanner'
import SpotsCandidates from './organisms/SpotsCandidates'
import SpotsMap from './organisms/SpotsMap'

const FeaturedPlaces = () => {
  const [open, setOpen] = React.useState(false)
  const places = React.useContext(SelectedPlacesContext)
  const handleNext = React.useContext(StepperHandlerContext)

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
          <Badge
            badgeContent={
              places.filter((item) => item.extendedProps?.placeId).length
            }
            color="primary">
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
          <Button
            variant="contained"
            disabled={places.length === 0}
            onClick={handleNext}>
            Get Route
          </Button>
        </Stack>
      </Box>
      <SpotsCandidates
        open={open}
        places={places
          .map((place) => place.extendedProps?.placeId)
          .filter((item): item is string => typeof item === 'string')}
        onOpen={handleOpen}
        onClose={handleClose}
      />
    </>
  )
}

export default FeaturedPlaces
