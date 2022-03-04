import * as React from 'react'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarSide } from '@fortawesome/free-solid-svg-icons'
import { EventApi } from '@fullcalendar/react'
import dayjs from 'dayjs'

import { MoveEvent } from 'contexts/SelectedPlacesProvider'
import { useToggle } from 'react-use'
import MoveEventToolbar from './MoveEventToolbar'

const calcDiff = (start: Date, end: Date) => {
  const min = dayjs(end).diff(dayjs(start), 'minute')
  return `${Math.floor(min / 60)}時間${min % 60}分`
}
type Props = {
  event: EventApi & { extendedProps: MoveEvent['extendedProps'] }
}
const MoveEventCard: React.FC<Props> = ({ event }) => {
  const [open, toggle] = useToggle(false)
  return (
    <ClickAwayListener
      onClickAway={(e) => {
        console.log(e)
        toggle(false)
      }}>
      <Box
        onClick={() => toggle(true)}
        sx={{
          width: '100%',
          height: '100%',
          display: 'grid',
          overflow: 'hidden',
        }}>
        <Box
          sx={{
            display: 'flex',
            gridArea: '1/-1',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Typography variant={'h5'}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FontAwesomeIcon icon={faCarSide} />
              <span>
                {event.start && event.end && calcDiff(event.start, event.end)}
              </span>
            </Stack>
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            display: open ? 'flex' : 'none',
            gridArea: '1/-1',
            alignItems: 'end',
          }}>
          <MoveEventToolbar event={event} />
        </Box>
      </Box>
    </ClickAwayListener>
  )
}

export default React.memo(MoveEventCard)
