import * as React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { Spot } from 'contexts/CurrentPlanProvider'
import { useSpotEditor } from 'contexts/SpotEditorProvider'
import dayjs from 'dayjs'
import { DocumentReference } from 'firebase/firestore'
import { useDocument } from 'hooks/firebase/useDocument'

type Props = {
  event: DocumentReference<Spot>
  start: Date
}
const SpotEventCard: React.FC<Props> = ({ event: eventRef, start }) => {
  const [spot] = useDocument(eventRef)
  const { open } = useSpotEditor()

  if (!spot) {
    return <>No spot ref</>
  }

  return (
    <Box
      onClick={() => open(spot)}
      sx={{
        border: (theme) => `solid ${theme.palette.grey[300]} 1px`,
        borderRadius: 2,
      }}>
      <Box px={1} py={2}>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Stack
              justifyContent="space-between"
              alignItems="center"
              height="100%">
              <Typography variant="subtitle1">
                {dayjs(start).format('HH:mm')}
              </Typography>
              <Box
                flexGrow={1}
                sx={{
                  border: (theme) => `solid ${theme.palette.grey[300]} 1px`,
                  width: 0,
                  borderRadius: 5,
                }}
              />
              <Typography variant="subtitle1">
                {dayjs(start)
                  .add(spot.duration, spot.durationUnit)
                  .format('HH:mm')}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={9}>
            <Stack
              justifyContent="left"
              alignItems="space-between"
              spacing={1}
              height="100%">
              <Typography variant="h3" noWrap>
                {spot.name}
              </Typography>
              {spot.labels?.[0] ? (
                <Stack direction="row" spacing={1}>
                  <Chip label={spot.labels[0]} />
                  {spot.labels.length > 1 && (
                    <Chip label={`+${spot.labels.length - 1}`} />
                  )}
                </Stack>
              ) : (
                <Chip sx={{ visibility: 'hidden' }}></Chip>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default SpotEventCard
