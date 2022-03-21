import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
import { faBicycle, faCar, faWalking } from '@fortawesome/free-solid-svg-icons'

import { MoveEvent } from 'hooks/usePlanEvents'
import { useDirections } from 'hooks/googlemaps/useDirections'
import { useTravelPlan } from 'hooks/useTravelPlan'

export const MoveTypes: Record<
  MoveEvent['extendedProps']['mode'],
  FontAwesomeIconProps['icon']
> = {
  car: faCar,
  walk: faWalking,
  bicycle: faBicycle,
}

type Props = {
  event: MoveEvent
}
const MoveEventToolbar: React.FC<Props> = ({ event }) => {
  const { actions: directions } = useDirections()
  const [, planActions] = useTravelPlan()

  const handleClickMode = (mode: keyof typeof MoveTypes) => async () => {
    const travelMode = () => {
      switch (mode) {
        case 'car':
          return google.maps.TravelMode.DRIVING
        case 'walk':
          return google.maps.TravelMode.WALKING
        case 'bicycle':
          return google.maps.TravelMode.BICYCLING

        default:
          throw new Error(`${mode} is not implemented`)
      }
    }

    const result = await directions.search({
      origin: { placeId: event.extendedProps.from },
      destination: { placeId: event.extendedProps.to },
      travelMode: travelMode(),
    })

    if (result.routes[0].legs.length > 0) {
      const durationSec = result.routes[0].legs[0].duration?.value || 0

      planActions.updateRoute({
        ...event.extendedProps,
        duration: durationSec,
        durationUnit: 'second',
        mode: mode,
      })
    }
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ backgroundColor: 'lightgray', width: '100%', px: 1 }}>
      {Object.entries(MoveTypes).map(([key, icon]) => (
        <IconButton
          key={key}
          color={key === event.extendedProps.mode ? 'primary' : 'inherit'}
          onClick={handleClickMode(key as keyof typeof MoveTypes)}>
          <FontAwesomeIcon icon={icon} />
        </IconButton>
      ))}
    </Stack>
  )
}

export default MoveEventToolbar
