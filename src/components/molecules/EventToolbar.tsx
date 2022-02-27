import * as React from 'react'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowDown,
  faArrowUp,
  faEdit,
  faRemove,
} from '@fortawesome/free-solid-svg-icons'
import { EventApi } from '@fullcalendar/react'

import { useSelectSpots } from 'hooks/useSelectSpots'
import { MoveEvent, SpotEvent } from 'contexts/SelectedPlacesProvider'

type Props = {
  event: EventApi
}
const EventToolbar: React.FC<Props> = ({ event }) => {
  const [spots, spotsApi] = useSelectSpots()

  const handleUp = async () => {
    console.log('up')
    const i = spots
      .filter((spot): spot is SpotEvent => spot.extendedProps.type === 'spot')
      .findIndex((spot) => spot.id === event.id)
    if (i === 0) {
      console.log('cannot move up event')
      return
    }

    const moveTo = spots.find(
      (spot): spot is MoveEvent =>
        spot.extendedProps.type === 'move' &&
        spot.extendedProps.from === event.extendedProps.placeId
    )
    const moveFrom = spots.find(
      (spot): spot is MoveEvent =>
        spot.extendedProps.type === 'move' &&
        spot.extendedProps.to === event.extendedProps.placeId
    )

    const beforeSpotPlaceId = moveFrom?.extendedProps.from
    const beforeSpotMoveFrom = spots.find(
      (spot): spot is MoveEvent =>
        spot.extendedProps.type === 'move' &&
        spot.extendedProps.to === beforeSpotPlaceId
    )

    const insertSpotId = beforeSpotMoveFrom?.extendedProps.from

    moveFrom && spotsApi.remove(moveFrom.id)
    moveTo && spotsApi.remove(moveTo.id)
    beforeSpotMoveFrom && spotsApi.remove(beforeSpotMoveFrom.id)

    await spotsApi.add(
      {
        placeId: event.extendedProps.placeId,
        imageUrl: event.extendedProps.imageUrl,
      },
      insertSpotId
    )
    beforeSpotPlaceId &&
      (await spotsApi.add(
        {
          placeId: beforeSpotPlaceId,
          imageUrl: event.extendedProps.imageUrl,
        },
        event.extendedProps.placeId
      ))

    moveTo &&
      spotsApi.add(
        {
          placeId: moveTo.extendedProps.to,
          imageUrl: event.extendedProps.imageUrl,
        },
        beforeSpotPlaceId
      )
  }

  const handleDown = () => {
    console.log('down')
  }

  const handleEdit = () => {
    console.log('edit')
  }

  const handleRemove = () => {
    spotsApi.remove(event.id)
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ backgroundColor: 'lightgray', width: '100%', px: 1 }}>
      <IconButton onClick={handleUp}>
        <FontAwesomeIcon icon={faArrowUp} />
      </IconButton>
      <IconButton onClick={handleDown}>
        <FontAwesomeIcon icon={faArrowDown} />
      </IconButton>
      <IconButton onClick={handleEdit}>
        <FontAwesomeIcon icon={faEdit} />
      </IconButton>
      <div style={{ flexGrow: 1 }} />
      <IconButton onClick={handleRemove}>
        <FontAwesomeIcon icon={faRemove} />
      </IconButton>
    </Stack>
  )
}

export default EventToolbar
