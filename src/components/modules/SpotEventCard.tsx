import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import EventToolbar from 'components/modules/SpotEventToolbar'
import { SpotEvent } from 'hooks/usePlanEvents'
import { useWaypoints } from 'hooks/useWaypoints'

type Props = {
  event: SpotEvent
}
const SpotEventCard: React.FC<Props> = ({ event }) => {
  const [selected, setSelected] = React.useState(false)
  const [, waypointsApi] = useWaypoints()

  const handleMove = React.useCallback(
    (mode: 'up' | 'down') => () => {
      console.log(`move ${mode}`)
      waypointsApi.move(event.extendedProps.placeId, mode)
    },
    [event.extendedProps.placeId, waypointsApi]
  )

  const handleRemove = React.useCallback(() => {
    waypointsApi.remove(event.extendedProps.placeId)
  }, [event.extendedProps.placeId, waypointsApi])

  const handleClick = () => {
    if (event.id === 'start' || event.id === 'end') {
      return
    }
    setSelected(true)
  }

  const handleClickAway = () => {
    setSelected(false)
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        onClick={handleClick}
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
            background: 'linear-gradient(to top, transparent 60%, #0000009c)',
            alignItems: 'start',
            justifyContent: 'start',
            textAlign: 'start',
          }}>
          <Stack sx={{ pl: 1, pt: 0.5 }}>
            <Typography>{event.title}</Typography>
            <Typography variant="subtitle2">
              {event.start?.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Stack>
        </Box>
        {selected && (
          <Box
            sx={{
              display: 'flex',
              gridArea: '1/-1',
              alignItems: 'end',
            }}>
            <EventToolbar
              moveUp={handleMove('up')}
              moveDown={handleMove('down')}
              remove={handleRemove}
            />
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  )
}

export default SpotEventCard
