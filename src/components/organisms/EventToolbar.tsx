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
import {
  MoveEvent,
  ScheduleEvent,
  SpotEvent,
} from 'contexts/SelectedPlacesProvider'
import dayjs from 'dayjs'

type Props = {
  event: EventApi & { extendedProps: SpotEvent['extendedProps'] }
}
const EventToolbar: React.FC<Props> = ({ event }) => {
  const [spots, spotsApi] = useSelectSpots()
  const distanceMatrix = useDistanceMatrix()

  const handleUp = async () => {
    console.log('up')

    const moveFromSelected = spots.find(
      (spot): spot is MoveEvent =>
        spot.extendedProps.type === 'move' &&
        spot.extendedProps.from === event.extendedProps.placeId
    )
    const moveToSelected = spots.find(
      (spot): spot is MoveEvent =>
        spot.extendedProps.type === 'move' &&
        spot.extendedProps.to === event.extendedProps.placeId
    )

    const beforeSpot = spots.find(
      (spot): spot is SpotEvent =>
        spot.id === moveToSelected?.extendedProps.from
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

    // 選択中のスポットイベントを直前のスポットイベントと入れ替える
    const duration = dayjs(event.end).diff(event.start, 'minute')
    const newStart = moveToBeforeSpot ? moveToBeforeSpot.end : beforeSpot.start
    const newEnd = dayjs(newStart).add(duration, 'minute')
    spotsApi.update({
      ...(event.toJSON() as SpotEvent),
      start: newStart,
      end: newEnd.toDate(),
      extendedProps: {
        ...event.extendedProps,
        from: beforeSpot.extendedProps.from,
        to: beforeSpot.extendedProps.to,
      },
    })

    // 移動イベントを入れ替えたスポットイベントに合わせて更新する
    const moveDuration = dayjs(moveToSelected.end).diff(
      moveToSelected.start,
      'minute'
    )
    moveToSelected.start = newEnd.toDate()
    moveToSelected.end = newEnd.add(moveDuration, 'minute').toDate()
    spotsApi.update({
      ...moveToSelected,
      extendedProps: {
        ...moveToSelected.extendedProps,
        from: event.extendedProps.placeId,
        to: beforeSpot.id,
      },
    })

    // 入れ替える対象になる直前のイベントを更新する
    const beforeDuration = dayjs(beforeSpot.end).diff(
      beforeSpot.start,
      'minute'
    )
    beforeSpot.start = moveToSelected.end
    beforeSpot.end = dayjs(beforeSpot.start)
      .add(beforeDuration, 'minute')
      .toDate()
    spotsApi.update({
      ...beforeSpot,
      extendedProps: {
        ...beforeSpot.extendedProps,
        from: event.extendedProps.from,
        to: event.extendedProps.to,
      },
    })

    // 選択したイベントより後のイベントを更新する
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

      // Move イベントをたどって時刻の変更を適用する
      spotsApi.applyChange(moveFromSelected, moveEndChange)
    }
  }

  const handleDown = async () => {
    console.log('down')

    const moveFromSelected = spots.find(
      (spot): spot is MoveEvent =>
        spot.extendedProps.type === 'move' &&
        spot.extendedProps.from === event.id
    )
    const afterSpot = spots.find(
      (spot): spot is SpotEvent =>
        spot.id === moveFromSelected?.extendedProps.to
    )

    const moveFromAfter = spots.find(
      (spot): spot is MoveEvent =>
        spot.extendedProps.type === 'move' &&
        spot.extendedProps.from === afterSpot?.id
    )

    // 直後に移動イベントがない場合は移動不可
    if (moveFromSelected === undefined || afterSpot === undefined) {
      console.log('cannot move down event')
      return
    }

    // 選択したスポットへの移動イベントを取得
    const moveToSelected = spots.find(
      (spot): spot is MoveEvent =>
        spot.extendedProps.type === 'move' && spot.extendedProps.to === event.id
    )

    if (moveToSelected) {
      // 直後のスポットへの移動イベントを選択中のイベントへの移動イベントに更新
      const org = [{ placeId: moveToSelected.extendedProps.from }]
      const dest = [{ placeId: afterSpot.id }]
      const result = await distanceMatrix.search(org, dest)

      moveToSelected.end = dayjs(moveToSelected.start)
        .add(result.rows[0].elements[0].duration.value, 's')
        .toDate()
      moveToSelected.extendedProps.to = afterSpot.id
      spotsApi.update({ ...moveToSelected })
    }

    // 直前のスポットイベントを選択中のイベントに入れ替える
    const duration = dayjs(afterSpot.end).diff(afterSpot.start, 'minute')
    afterSpot.start = moveToSelected
      ? moveToSelected.end
      : event.start || new Date()
    afterSpot.end = dayjs(afterSpot.start).add(duration, 'minute').toDate()
    spotsApi.update({
      ...afterSpot,
      extendedProps: {
        ...afterSpot.extendedProps,
        from: event.extendedProps.from,
        to: event.extendedProps.to,
      },
    })

    // 移動イベントを入れ替えたスポットイベントに合わせて更新する
    const moveDuration = dayjs(moveFromSelected.end).diff(
      moveFromSelected.start,
      'minute'
    )
    moveFromSelected.start = afterSpot.end
    moveFromSelected.end = dayjs(afterSpot.end)
      .add(moveDuration, 'minute')
      .toDate()
    moveFromSelected.extendedProps.from = afterSpot.id
    moveFromSelected.extendedProps.to = event.id
    spotsApi.update({ ...moveFromSelected })

    // 選択中のイベントを更新する
    const eventDuration = dayjs(event.end).diff(event.start, 'minute')
    const newStart = moveFromSelected.end
    const newEnd = dayjs(newStart).add(eventDuration, 'minute').toDate()
    spotsApi.update({
      ...(event.toJSON() as SpotEvent),
      start: newStart,
      end: newEnd,
      extendedProps: {
        ...event.extendedProps,
        from: afterSpot.from,
        to: afterSpot.to,
      },
    })

    // 選択したイベントより後のイベントを更新する
    if (moveFromAfter) {
      const org = [{ placeId: event.id }]
      const dest = [{ placeId: moveFromAfter.extendedProps.to }]
      const result = await distanceMatrix.search(org, dest)

      moveFromAfter.start = newEnd
      const newMoveEnd = dayjs(moveFromAfter.start).add(
        result.rows[0].elements[0].duration.value,
        's'
      )
      const moveEndChange = newMoveEnd.diff(moveFromAfter.end, 'minute')
      moveFromAfter.end = newMoveEnd.toDate()
      moveFromAfter.extendedProps.from = event.id
      spotsApi.update({ ...moveFromAfter })

      // Move イベントをたどって時刻の変更を適用する
      spotsApi.applyChange(moveFromAfter, moveEndChange)
    }
  }

  const handleEdit = () => {
    console.log('edit')
  }

  const handleRemove = () => {
    spotsApi.remove(event.toJSON() as ScheduleEvent)
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
