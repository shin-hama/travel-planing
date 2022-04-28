import * as React from 'react'

import SpotsCandidates from 'components/modules/SpotsCandidates'
import { useTravelPlan } from 'hooks/useTravelPlan'

type Drawers = 'spots' | 'schedule'

const MapToolbar = () => {
  const [plan] = useTravelPlan()
  const [open, setOpen] = React.useState<Drawers | null>(null)

  const handleOpen = (mode: Drawers) => () => {
    setOpen(mode)
  }
  const handleClose = () => {
    setOpen(null)
  }

  return (
    <>
      {/* <Stack
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
      </Stack> */}
      <SpotsCandidates
        open={open === 'spots'}
        spots={plan?.waypoints || []}
        onOpen={() => handleOpen('spots')}
        onClose={handleClose}
      />
    </>
  )
}

export default MapToolbar
