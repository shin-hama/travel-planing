import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
import { faBicycle, faCar, faWalking } from '@fortawesome/free-solid-svg-icons'
import { EventApi } from '@fullcalendar/react'
import dayjs from 'dayjs'

import { MoveEvent } from 'contexts/ScheduleEventsProvider'
import { useDirections } from 'hooks/googlemaps/useDirections'
import { useSelectSpots } from 'hooks/useSelectSpots'

export const MoveTypes: Record<
  MoveEvent['extendedProps']['mode'],
  FontAwesomeIconProps['icon']
> = {
  car: faCar,
  walk: faWalking,
  bicycle: faBicycle,
}

type Props = {
  event: EventApi & { extendedProps: MoveEvent['extendedProps'] }
}
const MoveEventToolbar: React.FC<Props> = ({ event }) => {
  const { actions: directions } = useDirections()
  const eventsActions = useSelectSpots()

  const handleClickMode = (mode: keyof typeof MoveTypes) => async () => {
    const moveEvent = eventsActions.get<MoveEvent>(event.id, 'move')
    if (moveEvent === undefined) {
      console.error('event is not managed')
      return
    }
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

    const prev = eventsActions.getPrevSpot(moveEvent)
    const next = eventsActions.getNextSpot(moveEvent)

    const result = await directions.search({
      origin: { placeId: prev?.extendedProps.placeId },
      destination: { placeId: next?.extendedProps.placeId },
      travelMode: travelMode(),
    })

    if (result.routes[0].legs.length > 0) {
      const durationSec = result.routes[0].legs[0].duration?.value || 0
      const newEnd = dayjs(event.start).add(durationSec, 'second')
      const durationDiff = dayjs(newEnd).diff(moveEvent.end, 'minute')
      moveEvent.extendedProps.mode = mode
      eventsActions.update({
        ...moveEvent,
        end: newEnd.toDate(),
      })

      eventsActions.applyChange(moveEvent, durationDiff)
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
