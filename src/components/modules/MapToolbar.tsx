import * as React from 'react'
import Badge from '@mui/material/Badge'
import Stack from '@mui/material/Stack'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {
  faCalendarWeek,
  faEllipsis,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons'

import LabeledIconButton from 'components/elements/LabeledIconButton'
import SpotsCandidates from 'components/modules/SpotsCandidates'
import ScheduleViewer from 'components/layouts/ScheduleViewer'
import { useConfirm } from 'hooks/useConfirm'
import { useTravelPlan } from 'hooks/useTravelPlan'

type Drawers = 'spots' | 'schedule'

const MapToolbar = () => {
  const [plan, planApi] = useTravelPlan()
  const [open, setOpen] = React.useState<Drawers | null>(null)
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const confirm = useConfirm()

  const handleOpen = (mode: Drawers) => () => {
    setOpen(mode)
  }
  const handleClose = () => {
    setOpen(null)
  }

  const handleDelete = async () => {
    try {
      await confirm({
        title: 'CAUTION!!',
        description: '旅行プランが完全に削除されます。よろしいですか?',
      })
      await planApi.delete()
    } finally {
      setMenuAnchor(null)
    }
  }

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="baseline"
        sx={{ backgroundColor: (theme) => theme.palette.primary.main }}>
        <Badge badgeContent={plan?.waypoints.length} color="secondary">
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
        placeIds={plan?.waypoints.map((spot) => spot.placeId) || []}
        onOpen={() => handleOpen('spots')}
        onClose={handleClose}
      />
      <ScheduleViewer open={open === 'schedule'} onClose={handleClose} />
      <Menu
        id="basic-menu"
        anchorEl={menuAnchor}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        <MenuItem onClick={handleDelete}>Delete Plan</MenuItem>
      </Menu>
    </>
  )
}

export default MapToolbar
