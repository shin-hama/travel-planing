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

// import { useDistanceMatrix } from './useDistanceMatrix'
import { useSelectSpots } from 'hooks/useSelectSpots'
import { MoveEvent, SpotEvent } from 'contexts/SelectedPlacesProvider'
import dayjs from 'dayjs'

type Props = {
  event: EventApi
}
const EventToolbar: React.FC<Props> = ({ event }) => {
  const [spots, spotsApi] = useSelectSpots()
  // const distanceMatrix = useDistanceMatrix()

  const handleUp = async () => {
    console.log('up')

    const moveToSelected = spots.find(
      (spot): spot is MoveEvent =>
        spot.extendedProps.type === 'move' &&
        spot.extendedProps.to === event.extendedProps.placeId
    )
    const beforeSpot = spots.find(
      (spot) => spot.id === moveToSelected?.extendedProps.from
    )

    if (moveToSelected === undefined || beforeSpot === undefined) {
      console.log('cannot move up event')
      return
    }

    moveToSelected.extendedProps.from = event.extendedProps.placeId
    moveToSelected.extendedProps.to = beforeSpot.id
    spotsApi.update(moveToSelected)

    const duration = dayjs(event.end).diff(event.start, 'minute')
    spotsApi.update({
      ...event.toJSON(),
      start: beforeSpot.start,
      end: dayjs(beforeSpot.start).add(duration, 'minute').toDate(),
    } as SpotEvent)

    const beforeDuration = dayjs(beforeSpot.end).diff(
      beforeSpot.start,
      'minute'
    )
    spotsApi.update({
      ...beforeSpot,
      start: event.start,
      end: dayjs(event.start).add(beforeDuration, 'minute').toDate(),
    } as SpotEvent)

    // const beforeSpotMoveFrom = spots.find(
    //   (spot): spot is MoveEvent =>
    //     spot.extendedProps.type === 'move' &&
    //     spot.extendedProps.to === beforeSpot.placeId
    // )
    // const moveFromSelected = spots.find(
    //   (spot): spot is MoveEvent =>
    //     spot.extendedProps.type === 'move' &&
    //     spot.extendedProps.from === event.extendedProps.placeId
    // )
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
