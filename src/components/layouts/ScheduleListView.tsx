import * as React from 'react'
import Alert from '@mui/material/Alert'
import Backdrop from '@mui/material/Backdrop'
import Snackbar from '@mui/material/Snackbar'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRoute, faBed } from '@fortawesome/free-solid-svg-icons'

import { usePlan } from 'hooks/usePlan'
import ListScheduler from 'components/modules/Schedule/ListScheduler'
import { useDirections } from 'hooks/googlemaps/useDirections'
import type { Route } from 'contexts/CurrentPlanProvider'
import { useConfirm } from 'hooks/useConfirm'
import { usePlanningTab } from 'contexts/PlanningTabProvider'
import { useEvents } from 'hooks/useEvents'
import { useSchedules } from 'hooks/useSchedules'
import { useFirestore } from 'hooks/firebase/useFirestore'

type Action = {
  label: string
  icon: React.ReactNode
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const ScheduleListView: React.FC = () => {
  const [plan] = usePlan()
  const [events] = useEvents()
  const [schedules] = useSchedules()
  const db = useFirestore()
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

  const handleAddHotel = React.useCallback(() => {
    openMap('selector')
  }, [openMap])

  const handleOptimizeRoute = React.useCallback(async () => {
    if (!plan || !schedules || !events) {
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
    const cloned = events.map((e) => e.data())
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

      const batch = db.writeBatch()

      const [dept, ...routes] = legs.map(
        (leg, i): Route => ({
          from: { lat: spots[i].lat, lng: spots[i].lng },
          to: { lat: spots[i + 1].lat, lng: spots[i + 1].lng },
          mode: 'driving',
          time: {
            ...leg.duration,
            unit: 'second',
          },
        })
      )
      batch.update(schedules.docs[0].ref, { dept })

      ordered.forEach((spot, i) => {
        const event = events.find(
          (e) => e.data().lat === spot.lat && e.data().lng === spot.lng
        )
        if (!event) {
          console.warn('Cannot find original reference')
          return
        }
        batch.update(event.ref, {
          ...spot,
          position: 1000 * (i + 1),
          next: routes[i] || undefined,
          schedule: schedules.docs[0].ref,
        })
      })

      batch.commit()
    } else {
      alert('cannot find roue')
    }
  }, [confirm, db, directions, events, plan, schedules])

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
      <ListScheduler />
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
        open={events.length === 0}
        autoHideDuration={6000}>
        <Alert severity={'info'}>地図上で行きたい場所を選んでください。</Alert>
      </Snackbar>
    </>
  )
}

export default ScheduleListView
