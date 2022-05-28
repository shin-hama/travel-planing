import * as React from 'react'
import Alert from '@mui/material/Alert'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRoute, faBed } from '@fortawesome/free-solid-svg-icons'

import { useRouter } from 'hooks/useRouter'
import { useTravelPlan } from 'hooks/useTravelPlan'
import ListScheduler from 'components/modules/ListScheduler'
import { useWaypoints } from 'hooks/useWaypoints'
import { useDirections } from 'hooks/googlemaps/useDirections'
import { useRoutes } from 'hooks/useRoutes'
import type { Route } from 'contexts/CurrentPlanProvider'
import { useConfirm } from 'hooks/useConfirm'
import { usePlanningTab } from 'contexts/PlanningTabProvider'

type Action = {
  label: string
  icon: React.ReactNode
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const ScheduleListView: React.FC = () => {
  const router = useRouter()
  const [plan] = useTravelPlan()
  const [waypoints, waypointsApi] = useWaypoints()
  const { routesApi } = useRoutes()
  const directions = useDirections()
  const confirm = useConfirm()
  const [, { openMap }] = usePlanningTab()

  const [open, setOpen] = React.useState(false)
  const handleClick = () => setOpen((prev) => !prev)
  const handleClose = React.useCallback((_, reason: string) => {
    if (reason !== 'mouseLeave') {
      setOpen(false)
    }
  }, [])

  React.useEffect(() => {
    if (!plan) {
      router.userHome(true)
    }
  }, [plan, router])

  const handleAddHotel = React.useCallback(() => {
    openMap('selector')
  }, [openMap])

  const handleOptimizeRoute = React.useCallback(async () => {
    if (!plan) {
      return
    }
    try {
      await confirm({
        title: 'Caution!',
        description: '現在のスケジュールが上書きされます。よろしいですか?',
        dialogProps: {
          maxWidth: 'sm',
          disableRestoreFocus: true,
        },
      })
    } catch {
      return
    }
    const cloned = Array.from(waypoints || [])
    const origin = plan.home
    const dest = plan.home
    const result = await directions.search({
      origin,
      destination: dest,
      waypoints: cloned,
      mode: 'driving',
    })

    if (result) {
      const { legs, ordered_waypoints: ordered } = result
      const spots = [origin, ...ordered, dest]
      waypointsApi.set(ordered)
      routesApi.add(
        ...legs.map(
          (leg, i): Route => ({
            from: spots[i].id || '',
            to: spots[i + 1].id || '',
            mode: 'driving',
            time: {
              ...leg.duration,
              unit: 'second',
            },
          })
        )
      )
    } else {
      alert('cannot find roue')
    }
  }, [confirm, directions, plan, routesApi, waypoints, waypointsApi])

  const actions = React.useMemo<Array<Action>>(() => {
    return [
      {
        label: 'ルート最適化',
        onClick: handleOptimizeRoute,
        icon: (
          <SvgIcon>
            <FontAwesomeIcon icon={faRoute} />
          </SvgIcon>
        ),
      },
      {
        label: 'ホテルを設定',
        onClick: handleAddHotel,
        icon: (
          <SvgIcon>
            <FontAwesomeIcon icon={faBed} />
          </SvgIcon>
        ),
      },
    ]
  }, [handleAddHotel, handleOptimizeRoute])

  return (
    <>
      <Box height="100%">
        <ListScheduler />
      </Box>
      <Backdrop open={open} />
      <SpeedDial
        open={open}
        onClick={handleClick}
        onClose={handleClose}
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'fixed', bottom: 100, right: 16 }}
        icon={<SpeedDialIcon />}>
        {actions.map((action) => (
          <SpeedDialAction
            key={action.label}
            icon={action.icon}
            tooltipTitle={action.label}
            tooltipOpen
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={waypoints?.length === 0}
        autoHideDuration={6000}>
        <Alert severity={'info'}>地図上で行きたい場所を選んでください。</Alert>
      </Snackbar>
    </>
  )
}

export default ScheduleListView
