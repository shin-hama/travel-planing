import * as React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import SpotsList from './SpotsList'
import type { SpotDTO } from './SpotCard'

type Props = {
  open: boolean
  spots: Array<SpotDTO>
  onOpen: () => void
  onClose: () => void
}
const SpotsCandidates: React.FC<Props> = ({ open, spots, onOpen, onClose }) => {
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        disableSwipeToOpen
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
                backgroundColor: (theme) => theme.palette.grey[300],
                borderRadius: 3,
                my: 1,
                mx: 'auto',
              }}
            />
            <Box ml={2}>
              <Typography variant="h4">行きたい所リスト</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              p: 2,
              overflow: 'auto',
            }}>
            <Container maxWidth="xs">
              {spots.length > 0 ? (
                <SpotsList spots={spots} />
              ) : (
                <Typography variant="subtitle1">
                  地図上で行きたい場所を選んでください。
                </Typography>
              )}
            </Container>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  )
}

export default SpotsCandidates
