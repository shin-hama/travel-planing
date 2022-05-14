import * as React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { Spot } from 'contexts/CurrentPlanProvider'
import dayjs from 'dayjs'
import { useRoutes } from 'hooks/useRoutes'
import { useSpotEditor } from 'contexts/SpotEditorProvider'

type Props = {
  spot: Spot
  prevSpots: Array<Spot>
  dayStart: Date
}
const SpotEventCard: React.FC<Props> = ({ spot, prevSpots, dayStart }) => {
  const { open } = useSpotEditor()
  const routesApi = useRoutes()

  const start = () => {
    let _start = dayjs(dayStart)
    prevSpots.forEach((prev) => {
      // このスポットよりも前にスケジュールされているスポットの滞在時間と移動時間を加算
      const nextRoute =
        prev.next &&
        routesApi.get({
          from: prev.id,
          to: prev.next.id,
          mode: prev.next.mode,
        })
      _start = dayjs(_start)
        .add(prev.duration, prev.durationUnit)
        .add(nextRoute?.time?.value || 0, nextRoute?.time?.unit)
    })

    return _start
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
                {start().format('HH:mm')}
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
                {start().add(spot.duration, spot.durationUnit).format('HH:mm')}
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
