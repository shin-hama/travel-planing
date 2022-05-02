import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons'

import { useScheduleEvents } from 'hooks/useScheduleEvents'
import SpotCard from './SpotCard'
import DayMenu from './DayMenu'
import { useList } from 'react-use'

const ListScheduler: React.FC = () => {
  const [events] = useScheduleEvents()
  const [days, setDays] = useList([1])
  const [target, setTarget] = React.useState(0)
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)

  const handleAddDay = () => {
    setDays.push(days.length + 1)
  }

  const handleRemoveDay = (value: number) => () => {
    setDays.filter((day) => day !== value)
    setTarget(0)
  }

  const handleOpenMenu = (value: number, anchor: HTMLElement) => {
    setTarget(value)
    setAnchor(anchor)
  }

  return (
    <>
      <Stack direction="row" spacing={4}>
        {days.map((day) => (
          <Stack key={`day-${day}`} spacing={2} width="400px">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between">
              <Typography>Day {day}</Typography>
              <Box>
                <IconButton onClick={handleAddDay}>
                  <SvgIcon>
                    <FontAwesomeIcon icon={faPlus} />
                  </SvgIcon>
                </IconButton>
                <IconButton
                  onClick={(e) => handleOpenMenu(day, e.currentTarget)}>
                  <SvgIcon>
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </SvgIcon>
                </IconButton>
              </Box>
            </Stack>
            {events.map((event) => (
              <SpotCard key={event.id} spot={event} />
            ))}
          </Stack>
        ))}
      </Stack>
      <DayMenu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => {
          setTarget(0)
          setAnchor(null)
        }}
        onDelete={handleRemoveDay(target)}
      />
    </>
  )
}

export default ListScheduler
