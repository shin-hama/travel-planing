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

import { useDistanceMatrix } from 'hooks/useDistanceMatrix'
import { useSelectSpots } from 'hooks/useSelectSpots'
import { MoveEvent, SpotEvent } from 'contexts/SelectedPlacesProvider'
import dayjs from 'dayjs'

type Props = {
  event: EventApi
}
const EventToolbar: React.FC<Props> = ({ event }) => {
  const [spots, spotsApi] = useSelectSpots()
  const distanceMatrix = useDistanceMatrix()

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

    // 直前に移動イベントがない場合は移動不可
    if (moveToSelected === undefined || beforeSpot === undefined) {
      console.log('cannot move up event')
      return
    }

    // 直前のスポットへの移動イベントを取得
    const moveToBeforeSpot = spots.find(
      (spot): spot is MoveEvent =>
        spot.extendedProps.type === 'move' &&
        spot.extendedProps.to === beforeSpot.id
    )

    if (moveToBeforeSpot) {
      // 直前のスポットへの移動イベントを選択中のイベントへの移動イベントに更新
      const org = [{ placeId: moveToBeforeSpot.extendedProps.from }]
      const dest = [{ placeId: event.extendedProps.placeId }]
      const result = await distanceMatrix.search(org, dest)

      moveToBeforeSpot.end = dayjs(moveToBeforeSpot.start)
        .add(result.rows[0].elements[0].duration.value, 's')
        .toDate()
      moveToBeforeSpot.extendedProps.to = event.extendedProps.placeId
      spotsApi.update({ ...moveToBeforeSpot })
    }

    const duration = dayjs(event.end).diff(event.start, 'minute')
    const newStart = moveToBeforeSpot ? moveToBeforeSpot.end : beforeSpot.start
    const newEnd = dayjs(newStart).add(duration, 'minute')
    spotsApi.update({
      ...(event.toJSON() as SpotEvent),
      start: newStart,
      end: newEnd.toDate(),
    })

    const moveDuration = dayjs(moveToSelected.end).diff(
      moveToSelected.start,
      'minute'
    )
    moveToSelected.start = newEnd.toDate()
    moveToSelected.end = newEnd.add(moveDuration, 'minute').toDate()
    spotsApi.update({
      ...moveToSelected,
      extendedProps: {
        type: 'move',
        from: event.extendedProps.placeId,
        to: beforeSpot.id,
      },
    })

    const beforeDuration = dayjs(beforeSpot.end).diff(
      beforeSpot.start,
      'minute'
    )
    beforeSpot.start = moveToSelected.end
    beforeSpot.end = dayjs(beforeSpot.start)
      .add(beforeDuration, 'minute')
      .toDate()
    spotsApi.update({ ...beforeSpot })

    const moveFromSelected = spots.find(
      (spot): spot is MoveEvent =>
        spot.extendedProps.type === 'move' &&
        spot.extendedProps.from === event.extendedProps.placeId
    )
    if (moveFromSelected) {
      const org = [{ placeId: beforeSpot.id }]
      const dest = [{ placeId: moveFromSelected.extendedProps.to }]
      const result = await distanceMatrix.search(org, dest)

      moveFromSelected.start = beforeSpot.end
      const newMoveEnd = dayjs(moveFromSelected.start).add(
        result.rows[0].elements[0].duration.value,
        's'
      )
      const moveEndChange = newMoveEnd.diff(moveFromSelected.end, 'minute')
      moveFromSelected.end = newMoveEnd.toDate()
      moveFromSelected.extendedProps.from = beforeSpot.id
      spotsApi.update({ ...moveFromSelected })

      // 移動時間の変化量を、当日のその後のイベント全てに適用する
      spots
        .filter(
          (spot) =>
            spot.start.getDate() === newMoveEnd.date() &&
            spot.start > moveFromSelected.start
        )
        .forEach((spot) =>
          spotsApi.update({
            ...spot,
            start: dayjs(spot.start).add(moveEndChange, 'minute').toDate(),
            end: dayjs(spot.end).add(moveEndChange, 'minute').toDate(),
          })
        )
    }
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
