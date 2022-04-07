import * as React from 'react'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
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
import { useConfirm } from 'hooks/useConfirm'
import { usePlans } from 'hooks/usePlan'
import { Plan } from 'contexts/CurrentPlanProvider'

type Drawers = 'spots' | 'schedule'

const PlanPage = () => {
  const router = useRouter()
  const { planId } = router.query
  const { get: getPlan } = usePlans()

  const [, planApi] = useTravelPlan()
  const [plan, setPlan] = React.useState<Plan | null>(null)
  const [open, setOpen] = React.useState<Drawers | null>(null)
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const confirm = useConfirm()

  React.useEffect(() => {
    const func = async () => {
      console.log(planId)

      if (typeof planId === 'string') {
        getPlan(planId)
          .then((target) => {
            console.log(target)
            if (!target) {
              console.error(`Plan is not exist. ID: ${planId}`)
              router.replace('/home')
              return
            }
            setPlan(target)
          })
          .catch(() => {
            router.replace('/home')
          })
      }
    }

    func()
  }, [planId])

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
          <LabeledIconButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            icon={faEllipsis}
            label={'設定'}
          />
        </Stack>
      </Box>
      <SpotsCandidates
        open={open === 'spots'}
        placeIds={plan.waypoints.map((spot) => spot.placeId)}
        onOpen={() => handleOpen('spots')}
        onClose={handleClose}
      />
      <ScheduleViewer open={open === 'schedule'} onClose={handleClose} />
      <Menu
        id="basic-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        <MenuItem onClick={handleDelete}>Delete Plan</MenuItem>
      </Menu>
    </PlanningLayout>
  )
}

export default PlanPage
