import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { Spot, useSelectedPlacesActions } from 'contexts/SelectedPlacesProvider'
import SpotCard from './SpotCard'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

type Props = {
  open: boolean
  places: Array<Spot>
  onOpen: () => void
  onClose: () => void
}
const SpotsCandidates: React.FC<Props> = ({
  open,
  places,
  onOpen,
  onClose,
}) => {
  const actions = useSelectedPlacesActions()

  const handleClickRemove = (placeId: string) => {
    actions.filter(item => item.placeId !== placeId)
  }

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        swipeAreaWidth={15}
        ModalProps={{
          keepMounted: true,
        }}>
        <Box
          sx={{
            maxHeight: '50vh',
          }}>
          <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
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
            </Stack>
          </Box>
          <Box
            sx={{
              p: 2,
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
            </Stack>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  )
}

export default SpotsCandidates
