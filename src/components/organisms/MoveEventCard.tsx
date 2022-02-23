import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarSide } from '@fortawesome/free-solid-svg-icons'
import { EventApi } from '@fullcalendar/react'
import dayjs from 'dayjs'

const calcDiff = (start: Date, end: Date) => {
  const min = dayjs(end).diff(dayjs(start), 'minute')
  return `${Math.floor(min / 60)}時間${min % 60}分`
}
type Props = {
  event: EventApi
}
const MoveEventCard: React.FC<Props> = ({ event }) => {
  console.log(event)
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ height: '100%', color: 'black' }}>
      <Typography variant={'h5'}>
        <Stack direction="row" spacing={1} alignItems="center">
          <FontAwesomeIcon icon={faCarSide} />
          <span>
            {event.start && event.end && calcDiff(event.start, event.end)}
          </span>
        </Stack>
      </Typography>
    </Box>
  )
}

export default MoveEventCard
