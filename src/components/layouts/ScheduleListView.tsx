import * as React from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRoute } from '@fortawesome/free-solid-svg-icons'

import SchedulerHeader from 'components/modules/SchedulerHeader'
import { useRouter } from 'hooks/useRouter'
import { useTravelPlan } from 'hooks/useTravelPlan'
import ListScheduler from 'components/modules/ListScheduler'
import { useWaypoints } from 'hooks/useWaypoints'
import { useDirections } from 'hooks/googlemaps/useDirections'
import { useRoutes } from 'hooks/useRoutes'
import type { Route } from 'contexts/CurrentPlanProvider'

type Action = {
  label: string
  icon: React.ReactNode
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

type Props = {
  onClose: () => void
}
const ScheduleListView: React.FC<Props> = ({ onClose }) => {
  const router = useRouter()
  const [plan, planApi] = useTravelPlan()
  const [waypoints, waypointsApi] = useWaypoints()
  const routesApi = useRoutes()
  const directions = useDirections()

  React.useEffect(() => {
    if (!plan) {
      router.userHome(true)
    }
  }, [plan, router])

  const handleUpdate = React.useCallback(
    (title: string) => {
      planApi.update({ title })
    },
    [planApi]
  )

  const handleAddHotel = React.useCallback(() => {
    onClose()
  }, [onClose])

  const handleOptimizeRoute = React.useCallback(async () => {
    if (!plan) {
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
            from: spots[i].placeId || '',
            to: spots[i + 1].placeId || '',
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
  }, [directions, plan, routesApi, waypoints, waypointsApi])

  const actions = React.useMemo<Array<Action>>(
    () => [
      {
        label: 'ルート最適化',
        onClick: handleOptimizeRoute,
        icon: (
          <SvgIcon>
            <FontAwesomeIcon icon={faRoute} />
          </SvgIcon>
        ),
      },
    ],
    [handleOptimizeRoute]
  )

  if (!plan) {
    return <></>
  }
  return (
    <>
      <Stack height="100%">
        <SchedulerHeader
          plan={plan}
          addHotel={handleAddHotel}
          updateTitle={handleUpdate}
        />
        <ListScheduler />
      </Stack>
      <SpeedDial
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
