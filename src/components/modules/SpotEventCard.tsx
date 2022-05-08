import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { Spot } from 'contexts/CurrentPlanProvider'
import dayjs from 'dayjs'

type Props = {
  spot: Spot
}
const SpotEventCard: React.FC<Props> = ({ spot }) => {
  const start = new Date()
  return (
    <Card>
      <CardContent>
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
                  border: (theme) => `solid ${theme.palette.grey[300]}`,
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
              <Box>
                <Chip label="category" />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SpotEventCard
