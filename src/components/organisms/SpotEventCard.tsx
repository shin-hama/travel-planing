import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { EventApi } from '@fullcalendar/react'

type Props = {
  event: EventApi
}
const SpotEventCard: React.FC<Props> = ({ event }) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        overflow: 'hidden',
        borderRadius: 1,
      }}>
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
          background: 'linear-gradient(to bottom, transparent 40%, #0000009c)',
          alignItems: 'end',
          justifyContent: 'end',
          textAlign: 'end',
        }}>
        <Stack sx={{ pr: 1, pb: 0.5 }}>
          <Typography variant="subtitle2">
            {event.start?.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
          <Typography>{event.title}</Typography>
        </Stack>
      </Box>
    </Box>
  )
}

export default SpotEventCard
