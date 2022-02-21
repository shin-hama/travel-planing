import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { EventApi } from '@fullcalendar/react'

type Props = {
  event: EventApi
}
const SpotEventCard: React.FC<Props> = ({ event }) => {
  return (
    <Box sx={{ height: '100%', display: 'grid' }}>
      <Box
        sx={{
          height: '100%',
          gridArea: '1/-1',
          backgroundImage: `url(${event.extendedProps.imageUrl})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          gridArea: '1/-1',
          margin: 'auto',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}>
        <Typography>{event.title}</Typography>
      </Box>
    </Box>
  )
}

export default SpotEventCard
