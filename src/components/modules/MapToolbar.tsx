import * as React from 'react'
import Badge from '@mui/material/Badge'
import Stack from '@mui/material/Stack'
import {
  faCalendarWeek,
  faEllipsis,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons'

import LabeledIconButton from 'components/elements/LabeledIconButton'
import SpotsCandidates from 'components/modules/SpotsCandidates'
import ScheduleViewer from 'components/layouts/ScheduleViewer'
import { useTravelPlan } from 'hooks/useTravelPlan'
import PlanMenu from './PlanMenu'

type Drawers = 'spots' | 'schedule'

const MapToolbar = () => {
  const [plan] = useTravelPlan()
  const [open, setOpen] = React.useState<Drawers | null>(null)
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)

  const handleOpen = (mode: Drawers) => () => {
    setOpen(mode)
  }
  const handleClose = () => {
    setOpen(null)
  }

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="baseline">
        <Badge badgeContent={plan?.waypoints.length} color="primary">
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
        <LabeledIconButton
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          icon={faEllipsis}
          label={'設定'}
        />
      </Stack>
      <SpotsCandidates
        open={open === 'spots'}
        spots={plan?.waypoints || []}
        onOpen={() => handleOpen('spots')}
        onClose={handleClose}
      />
      <ScheduleViewer open={open === 'schedule'} onClose={handleClose} />
      <PlanMenu
        anchorEl={menuAnchor}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      />
    </>
  )
}

export default MapToolbar
