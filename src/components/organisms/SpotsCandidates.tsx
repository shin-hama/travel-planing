import * as React from 'react'
import { Global } from '@emotion/react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { Spot, useSelectedPlacesActions } from 'contexts/SelectedPlacesProvider'
// import ListViewer from 'components/molecules/ListViewer'
import SpotCard from './SpotCard'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

type Props = {
  places: Array<Spot>
  handleNext: () => void
}
const SpotsCandidates: React.FC<Props> = ({ places, handleNext }) => {
  const actions = useSelectedPlacesActions()
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const handleClickRemove = (placeId: string) => {
    actions.filter(item => item.placeId !== placeId)
  }

  return (
    <>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${56}px)`,
            overflow: 'visible',
          },
        }}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={56}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: -56,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}>
          <Box
            sx={{
              width: 30,
              height: 6,
              backgroundColor: theme => theme.palette.grey[300],
              borderRadius: 3,
              position: 'absolute',
              top: 8,
              left: 'calc(50% - 15px)',
            }}
          />
          <Stack direction="row" alignItems="center">
            <Typography sx={{ flexGrow: 1 }}>Selected Spots:</Typography>
            <Button disabled={places.length < 2} onClick={handleNext}>
              Get Route
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}>
          <Stack spacing={2}>
            {places.map(place => (
              <SpotCard
                key={place.placeId}
                placeId={place.placeId}
                actionNode={
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleClickRemove(place.placeId)}
                    sx={{ marginLeft: 'auto' }}>
                    Remove
                  </Button>
                }
              />
            ))}
          </Stack>{' '}
        </Box>
      </SwipeableDrawer>
      {/* <ListViewer></ListViewer> */}
    </>
  )
}

export default SpotsCandidates
