import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'

type Props = {
  name: string
  date: Date
}
const HomeEventCard: React.FC<Props> = ({ name, date }) => {
  return (
    <Box
      sx={{
        border: (theme) => `solid ${theme.palette.grey[300]} 1px`,
        borderRadius: 2,
      }}>
      <Box px={1} py={2}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={3}>
            <Typography textAlign="center" variant="subtitle1">
              {dayjs(date).format('HH:mm')}
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h6" noWrap>
              {name}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default HomeEventCard
