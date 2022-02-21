import * as React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import { EventApi } from '@fullcalendar/react'

type Props = {
  event: EventApi
}
const SpotEventCard: React.FC<Props> = ({ event }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <Grid container sx={{}}>
        <Grid item xs={8}>
          {event.title}
        </Grid>
        <Grid item xs={4} justifyContent="center">
          {event.extendedProps.imageUrl && (
            <CardMedia
              component="img"
              src={`${event.extendedProps.imageUrl}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${event.extendedProps.imageUrl}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={'spot'}
              loading="lazy"
              style={{ maxHeight: '100%', objectFit: 'cover' }}
            />
          )}
        </Grid>
      </Grid>
    </Card>
  )
}

export default SpotEventCard
