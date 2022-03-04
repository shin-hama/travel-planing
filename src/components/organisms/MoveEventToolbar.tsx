import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
import { faCar, faWalking } from '@fortawesome/free-solid-svg-icons'
import { EventApi } from '@fullcalendar/react'
import dayjs from 'dayjs'

import { MoveEvent } from 'contexts/SelectedPlacesProvider'
import { useDirections } from 'hooks/useDirections'
import { useSelectSpots } from 'hooks/useSelectSpots'

const menus: Record<
  MoveEvent['extendedProps']['mode'],
  FontAwesomeIconProps['icon']
> = {
  car: faCar,
  walk: faWalking,
}

type Props = {
  event: EventApi & { extendedProps: MoveEvent['extendedProps'] }
}
const MoveEventToolbar: React.FC<Props> = ({ event }) => {
  const directions = useDirections()
  const [, eventsApi] = useSelectSpots()

  const handleClickMode = (mode: keyof typeof menus) => async () => {
    const moveEvent = eventsApi.get<MoveEvent>(event.id, 'move')
    if (moveEvent === undefined) {
      console.error('event is not managed')
      return
    }
    const travelMode =
      mode === 'car'
        ? google.maps.TravelMode.DRIVING
        : google.maps.TravelMode.WALKING

    const result = await directions.search({
      origin: { placeId: event.extendedProps.from },
      destination: { placeId: event.extendedProps.to },
      travelMode,
    })

    if (result.routes[0].legs.length > 0) {
      const durationSec = result.routes[0].legs[0].duration?.value || 0
      const newEnd = dayjs(event.start).add(durationSec, 'second')
      const durationDiff = dayjs(newEnd).diff(moveEvent.end, 'minute')
      moveEvent.extendedProps.mode = mode
      eventsApi.update({
        ...moveEvent,
        end: newEnd.toDate(),
      })

      eventsApi.applyChange(moveEvent, durationDiff)
    }
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ backgroundColor: 'lightgray', width: '100%', px: 1 }}>
      {Object.entries(menus).map(([key, icon]) => (
        <IconButton
          key={key}
          color={key === event.extendedProps.mode ? 'primary' : 'inherit'}
          onClick={handleClickMode(key as keyof typeof menus)}>
          <FontAwesomeIcon icon={icon} />
        </IconButton>
      ))}
    </Stack>
  )
}

export default MoveEventToolbar
