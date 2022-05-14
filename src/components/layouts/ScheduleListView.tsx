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
import { useMapLayer } from 'contexts/MapLayerModeProvider'
import { useConfirm } from 'hooks/useConfirm'

type Action = {
  label: string
  icon: React.ReactNode
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

type Props = {
  openMapView: () => void
}
const ScheduleListView: React.FC<Props> = ({ openMapView }) => {
  const router = useRouter()
  const [plan] = useTravelPlan()
  const [waypoints, waypointsApi] = useWaypoints()
  const routesApi = useRoutes()
  const directions = useDirections()
  const [, setLayer] = useMapLayer()
  const confirm = useConfirm()

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = React.useCallback(() => setOpen(false), [])

  React.useEffect(() => {
    if (!plan) {
      router.userHome(true)
    }
  }, [plan, router])

  const handleAddHotel = React.useCallback(() => {
    openMapView()
    setLayer('selector')
  }, [setLayer])

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
              unit: 'seconds',
            },
          })
        )
      )
    } else {
      alert('cannot find roue')
    }
  }, [plan, waypoints])

  const actions = React.useMemo<Array<Action>>(() => {
    const handleRun = (action: () => void) => () => {
      handleClose()
      action()
    }
    return [
      {
        label: 'ルート最適化',
        onClick: handleRun(handleOptimizeRoute),
        icon: (
          <SvgIcon>
            <FontAwesomeIcon icon={faRoute} />
          </SvgIcon>
        ),
      },
      {
        label: 'ホテルを設定',
        onClick: handleRun(handleAddHotel),
        icon: (
          <SvgIcon>
            <FontAwesomeIcon icon={faBed} />
          </SvgIcon>
        ),
      },
    ]
  }, [handleAddHotel, handleClose, handleOptimizeRoute])

  return (
    <>
      <Box height="100%">
        <ListScheduler />
      </Box>
      <Backdrop open={open} />
      <SpeedDial
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
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
