import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import TimePicker from './TimePicker'

type Props = {
  day: number
  onOpenMenu: (anchor: HTMLElement) => void
}
const DayHeader: React.FC<Props> = ({ day, onOpenMenu }) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Day {day}</Typography>
        <TimePicker type="text" />
        <Typography> ~ </Typography>
        <TimePicker type="text" />
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
