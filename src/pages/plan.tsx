import * as React from 'react'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import {
  faCalendarWeek,
  faEllipsis,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

import LabeledIconButton from 'components/elements/LabeledIconButton'
import SpotsCandidates from 'components/modules/SpotsCandidates'
import SpotsMap from 'components/modules/SpotsMap'
import PlanningLayout from 'components/layouts/PlaningLayout'
import ScheduleViewer from 'components/layouts/ScheduleViewer'
import { useTravelPlan } from 'hooks/useTravelPlan'

type Drawers = 'spots' | 'schedule'

const FeaturedPlaces = () => {
  const router = useRouter()
  const [plan] = useTravelPlan()
  const [open, setOpen] = React.useState<Drawers | null>(null)

  React.useEffect(() => {
    if (!plan) {
      router.replace('/')
    }
  }, [plan, router])

  const handleOpen = (mode: Drawers) => () => {
    setOpen(mode)
  }
  const handleClose = () => {
    setOpen(null)
  }

  if (!plan) {
    return <></>
  }

  return (
    <PlanningLayout>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <SpotsMap />
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="baseline">
          <Badge badgeContent={plan.waypoints.length} color="primary">
            <LabeledIconButton
              onClick={handleOpen('spots')}
              icon={faLocationDot}
              label={'行きたい所'}
            />
          </Badge>
          <LabeledIconButton
            onClick={handleOpen('schedule')}
            icon={faCalendarWeek}
            label={'スケジュール'}
          />
          <Box sx={{ display: 'none' }}>
            <LabeledIconButton
              onClick={() => console.log('setting')}
              icon={faEllipsis}
              label={'設定'}
            />
          </Box>
        </Stack>
      </Box>
      <SpotsCandidates
        open={open === 'spots'}
        placeIds={plan.waypoints.map((spot) => spot.placeId)}
        onOpen={() => handleOpen('spots')}
        onClose={handleClose}
      />
      <ScheduleViewer open={open === 'schedule'} onClose={handleClose} />
    </PlanningLayout>
  )
}

export default FeaturedPlaces
