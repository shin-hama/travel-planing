import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import TimePicker, { TimeValue } from '../TimeSelector'
import dayjs from 'dayjs'
import { Schedule } from 'hooks/useSchedules'

const fromMidnight = (date: Date) => date.getHours() * 60 + date.getMinutes()

type Props = {
  day: number
  schedule: Schedule
  onOpenMenu: (anchor: HTMLElement) => void
  onChangeSchedule: (updated: Partial<Schedule>) => void
}
const DayHeader: React.FC<Props> = ({
  day,
  schedule,
  onOpenMenu,
  onChangeSchedule,
}) => {
  const handleChange = React.useCallback(
    (value: TimeValue) => {
      if (schedule) {
        onChangeSchedule({
          start: dayjs(schedule.start)
            .hour(value.hour)
            .minute(value.minute)
            .toDate(),
        })
      }
    },
    [schedule, onChangeSchedule]
  )

  if (!schedule) {
    return <></>
  }
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Day {day}</Typography>
        <TimePicker
          type="text"
          label="開始時刻 : "
          value={fromMidnight(schedule.start)}
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
