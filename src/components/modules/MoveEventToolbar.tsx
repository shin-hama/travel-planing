import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
import { faBicycle, faCar, faWalking } from '@fortawesome/free-solid-svg-icons'

import { MoveEvent } from 'contexts/CurrentPlanProvider'
import { useDirections } from 'hooks/googlemaps/useDirections'
import { useRoutes } from 'hooks/useRoutes'
import { useWaypoints } from 'hooks/useWaypoints'

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
  const [, routesActions] = useRoutes()
  const [waypoints] = useWaypoints()

  const handleClickMode = (mode: keyof typeof MoveTypes) => async () => {
    const travelMode = () => {
      switch (mode) {
        case 'car':
          return 'driving'
        case 'walk':
          return 'walking'
        case 'bicycle':
          return 'bicycling'

        default:
          throw new Error(`${mode} is not implemented`)
      }
    }

    const org = waypoints?.find((spot) => spot.id === event.extendedProps.from)
    const dest = waypoints?.find((spot) => spot.id === event.extendedProps.to)

    if (!(org && dest)) {
      throw Error(`org or dest is not exists: org: ${org}, dest: ${dest}`)
    }
    const result = await directions.search({
      origin: { lat: org.lat, lng: org.lng },
      destination: { lat: dest.lat, lng: dest.lng },
      mode: travelMode(),
    })

    if (result && result.legs.length > 0) {
      const durationSec = result.legs[0].duration?.value || 0

      routesActions.updateRoute({
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
