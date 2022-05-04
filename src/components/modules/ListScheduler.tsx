import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons'

import SpotCard from './SpotCard'
import DayMenu from './DayMenu'
import { useList } from 'react-use'
import { useTravelPlan } from 'hooks/useTravelPlan'
import dayjs from 'dayjs'

const ListScheduler: React.FC = () => {
  const [plan, planApi] = useTravelPlan()
  const [days, setDays] = useList([1])
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)

  const handleAddDay = () => {
    if (!plan) {
      alert('plan is not selected')
      return
    }
    setDays.push(days.length + 1)
    planApi.update({
      events: [
        ...plan.events,
        {
          date: dayjs(plan.events[plan.events.length - 1].date)
            .add(1, 'day')
            .toDate(),
          spots: [],
        },
      ],
    })
  }

  const handleRemoveDay = () => {
    planApi.update({
      events: plan?.events.filter((_, i) => i !== plan.events.length - 1),
    })
  }

  const handleOpenMenu = (anchor: HTMLElement) => {
    setAnchor(anchor)
  }

  return (
    <>
      <Stack direction="row" spacing={4}>
        {plan?.events.map((event, i) => (
          <Stack key={`day-${i}`} spacing={2} width="400px">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between">
              <Typography>Day {i}</Typography>
              <Box>
                <IconButton onClick={handleAddDay}>
                  <SvgIcon>
                    <FontAwesomeIcon icon={faPlus} />
                  </SvgIcon>
                </IconButton>
                <IconButton onClick={(e) => handleOpenMenu(e.currentTarget)}>
                  <SvgIcon>
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </SvgIcon>
                </IconButton>
              </Box>
            </Stack>
            {event.spots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </Stack>
        ))}
      </Stack>
      <DayMenu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        onDelete={handleRemoveDay}
      />
    </>
  )
}

export default ListScheduler
