import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import TimePicker, { TimeValue } from './TimeSelector'
import { useTravelPlan } from 'hooks/useTravelPlan'
import dayjs from 'dayjs'

const fromMidnight = (date: Date) => date.getHours() * 60 + date.getMinutes()

type Props = {
  day: number
  onOpenMenu: (anchor: HTMLElement) => void
}
const DayHeader: React.FC<Props> = ({ day, onOpenMenu }) => {
  const [plan, planApi] = useTravelPlan()
  const event = plan?.events[day - 1]

  const handleChange = React.useCallback(
    (value: TimeValue) => {
      planApi.update({
        events: plan?.events.map((event, i) => {
          if (i === day - 1) {
            return {
              ...event,
              start: dayjs(event.start)
                .hour(value.hour)
                .minute(value.minute)
                .toDate(),
            }
          } else {
            return event
          }
        }),
      })
    },
    [day, plan?.events, planApi]
  )

  if (!event) {
    return <></>
  }
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Day {day}</Typography>
        <TimePicker
          type="text"
          label="開始時刻 : "
          value={fromMidnight(event.start)}
          onChange={handleChange}
        />
      </Stack>
      <Box>
        <IconButton onClick={(e) => onOpenMenu(e.currentTarget)}>
          <SvgIcon>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </SvgIcon>
        </IconButton>
      </Box>
    </Stack>
  )
}

export default DayHeader
