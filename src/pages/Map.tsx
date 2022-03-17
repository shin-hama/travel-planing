import * as React from 'react'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import {
  faLocationDot,
  faCalendarWeek,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

import LabeledIconButton from 'components/elements/LabeledIconButton'
import PlanningLayout from 'components/pages/PlaningLayout'
import SpotsCandidates from 'components/modules/SpotsCandidates'
import SpotsMap from 'components/modules/SpotsMap'
import { usePlanEvents } from 'hooks/usePlanEvents'
import { useSelectedSpots } from 'hooks/useSelectedSpots'
import { usePlan } from 'hooks/usePlan'

const FeaturedPlaces = () => {
  const router = useRouter()
  const [plan] = usePlan()
  const [, eventsActions] = usePlanEvents()
  const [spots, spotsActions] = useSelectedSpots()
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  React.useEffect(() => {
    spotsActions.init(plan?.events || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClickNext = async () => {
    await eventsActions.generateRoute(spots)
    router.push('Schedule')
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
          justifyContent="space-between"
          alignItems="baseline">
          <Badge badgeContent={spots.length} color="primary">
            <LabeledIconButton
              onClick={handleOpen}
              icon={faLocationDot}
              label={'行きたい所'}
            />
          </Badge>
          <LabeledIconButton
            onClick={handleClickNext}
            icon={faCalendarWeek}
            label={'スケジュール'}
          />
        </Stack>
      </Box>
      <SpotsCandidates
        open={open}
        placeIds={spots.map((spot) => spot.placeId)}
        onOpen={handleOpen}
        onClose={handleClose}
      />
    </PlanningLayout>
  )
}

export default FeaturedPlaces
