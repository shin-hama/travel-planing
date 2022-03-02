import * as React from 'react'
import dayjs from 'dayjs'

import {
  MoveEvent,
  ScheduleEvent,
  SelectedPlacesContext,
  Spot,
  SpotEvent,
  useSelectedPlacesActions,
} from 'contexts/SelectedPlacesProvider'
import { useDistanceMatrix } from './useDistanceMatrix'
import { useGetSpotByPkLazyQuery } from 'generated/graphql'

let eventGuid = 0

function createEventId() {
  return String(eventGuid++)
}

const findLastSpot = (spots: ScheduleEvent[]): SpotEvent | null => {
  const spotEvents = spots.filter(
    (spot): spot is SpotEvent => spot.extendedProps.type === 'spot'
  )

  let max: SpotEvent | null = null
  spotEvents.forEach((spot) => {
    if (!max) {
      max = spot
    }

    if (max.extendedProps.type === 'spot' && max.end < spot.end) {
      max = spot
    }
  })

  return max
}

export const useSelectSpots = () => {
  const places = React.useContext(SelectedPlacesContext)
  const actions = useSelectedPlacesActions()
  const distanceMatrix = useDistanceMatrix()

  const [getSpot] = useGetSpotByPkLazyQuery()

  const update = React.useCallback(
    (newSpot: ScheduleEvent) => {
      actions.update((spot) => spot.id === newSpot.id, newSpot)
    },
    [actions]
  )

  const add = React.useCallback(
    async (newSpot: Required<Pick<Spot, 'placeId' | 'imageUrl'>>) => {
      let start = dayjs('09:00:00', 'HH:mm:ss')

      const lastSpot = findLastSpot(places)
      let fromId: string | null = null
      if (lastSpot) {
        // 現在セットされている最後のイベントから新規スポットまでの道のりを計算
        const org = [{ placeId: lastSpot.extendedProps.placeId }]
        const dest = [{ placeId: newSpot.placeId }]
        const result = await distanceMatrix.search(org, dest)

        const moveStart = dayjs(lastSpot.end)
        const moveEnd = moveStart.add(
          result.rows[0].elements[0].duration.value,
          's'
        )
        if (moveEnd.hour() >= 19) {
          // 時刻がlimit を超えた場合は Move イベントはスキップして次の日へ移行する
          start = moveStart.add(1, 'day').hour(9).minute(0).second(0)
          fromId = lastSpot.id
        } else {
          const moveEvent: MoveEvent = {
            id: createEventId(),
            title: 'Car',
            start: moveStart.toDate(),
            end: moveEnd.toDate(),
            color: 'white',
            display: 'background',
            extendedProps: {
              type: 'move',
              from: lastSpot.extendedProps.placeId,
              to: newSpot.placeId,
            },
          }
          actions.push(moveEvent)

          lastSpot.extendedProps.to = moveEvent.id
          update(lastSpot)
          start = moveEnd
          fromId = moveEvent.id
        }
      }

      const spot = await getSpot({
        variables: { place_id: newSpot.placeId },
      })

      const spotEnd = start.add(1, 'hour')

      const spotEvent: SpotEvent = {
        id: newSpot.placeId,
        title: spot.data?.spots_by_pk?.name || '',
        start: start.toDate(),
        end: spotEnd.toDate(),
        color: 'transparent',
        extendedProps: {
          type: 'spot',
          placeId: newSpot.placeId,
          imageUrl: newSpot.imageUrl,
          from: fromId,
          to: null,
        },
      }
      console.log(spotEvent)

      actions.push(spotEvent)
    },
    [actions, distanceMatrix, getSpot, places, update]
  )

  const remove = React.useCallback(
    async (removed: ScheduleEvent) => {
      actions.filter((spot) => spot.id !== removed.id)

      if (removed.extendedProps.type === 'spot') {
        console.log('update Move event')
        console.log(removed)
        const beforeMove = places.find(
          (event): event is MoveEvent =>
            event.extendedProps.type === 'move' &&
            event.extendedProps.to === removed.id
        )
        const beforeSpotId = beforeMove?.extendedProps.from
        console.log(beforeMove)
        if (beforeSpotId) {
          remove(beforeMove)
        }
        // update after move if exists
        const afterMove = places.find(
          (event): event is MoveEvent =>
            event.extendedProps.type === 'move' &&
            event.extendedProps.from === removed.id
        )
        if (afterMove) {
          if (beforeSpotId) {
            // Calc distance between prev and next spot
            afterMove.extendedProps.from = beforeSpotId

            const org = [{ placeId: beforeSpotId }]
            const dest = [{ placeId: afterMove.extendedProps.to }]
            const result = await distanceMatrix.search(org, dest)

            afterMove.start = beforeMove.start
            const newMoveEnd = dayjs(afterMove.start).add(
              result.rows[0].elements[0].duration.value,
              's'
            )
            const moveEndChange = newMoveEnd.diff(afterMove.end, 'minute')
            afterMove.end = newMoveEnd.toDate()

            update({ ...afterMove })

            // Update all events after moved event
            const applyChange = (move: MoveEvent) => {
              const afterEvent = places.find(
                (spot) => spot.id === move.extendedProps.to
              )
              if (afterEvent) {
                update({
                  ...afterEvent,
                  start: dayjs(afterEvent.start)
                    .add(moveEndChange, 'minute')
                    .toDate(),
                  end: dayjs(afterEvent.end)
                    .add(moveEndChange, 'minute')
                    .toDate(),
                })
                const moveFrom = places.find(
                  (spot): spot is MoveEvent =>
                    spot.extendedProps.type === 'move' &&
                    spot.extendedProps.from === afterEvent?.id
                )
                if (moveFrom) {
                  update({
                    ...moveFrom,
                    start: dayjs(moveFrom.start)
                      .add(moveEndChange, 'minute')
                      .toDate(),
                    end: dayjs(moveFrom.end)
                      .add(moveEndChange, 'minute')
                      .toDate(),
                  })
                  applyChange(moveFrom)
                }
              }
            }

            applyChange(afterMove)
          } else {
            // Remove move event if previous spot is not exists
            remove(afterMove)
          }
        }
      }
    },
    [actions, distanceMatrix, places, update]
  )

  const insert = React.useCallback(
    async (inserted: SpotEvent) => {
      // Calc new schedule on moved date
      const destSpots = places.filter(
        (event): event is SpotEvent =>
          event.extendedProps.type === 'spot' &&
          dayjs(event.start).date() === dayjs(inserted.start).date()
      )
      const destPrevSpots = destSpots
        .filter((spot) => dayjs(spot.start) < dayjs(inserted.start))
        .sort((a, b) => dayjs(b.start).diff(a.start))
      const prevSpot = destPrevSpots.length > 0 ? destPrevSpots[0] : null

      const overlappedMoveEvent = places.find(
        (event): event is MoveEvent => event.id === prevSpot?.extendedProps.to
      )
      // save for update event start after inserted
      const orgMoveEnd = overlappedMoveEvent?.end
      const orgTo = overlappedMoveEvent?.extendedProps.to
      console.log(orgTo)

      let beforeMoveId: string | null = null
      if (prevSpot) {
        // 直前のイベントから移動したスポットへの MoveEvent を追加する
        const beforeOrg = [{ placeId: prevSpot.id }]
        const beforeDest = [{ placeId: inserted.id }]
        const beforeResult = await distanceMatrix.search(beforeOrg, beforeDest)
        const beforeMoveEnd = dayjs(prevSpot.end).add(
          beforeResult.rows[0].elements[0].duration.value,
          's'
        )

        if (overlappedMoveEvent) {
          // Update overlapped move event
          overlappedMoveEvent.end = beforeMoveEnd.toDate()
          overlappedMoveEvent.extendedProps.to = inserted.id
          update(overlappedMoveEvent)

          beforeMoveId = overlappedMoveEvent.id
        } else {
          const beforeMoveEvent: MoveEvent = {
            id: createEventId(),
            title: 'Car',
            start: prevSpot.end,
            end: beforeMoveEnd.toDate(),
            color: 'white',
            display: 'background',
            extendedProps: {
              type: 'move',
              from: beforeOrg[0].placeId,
              to: beforeDest[0].placeId,
            },
          }
          actions.push(beforeMoveEvent)

          beforeMoveId = beforeMoveEvent.id
        }

        update({
          ...prevSpot,
          extendedProps: {
            ...prevSpot.extendedProps,
            to: beforeMoveId,
          },
        })
        // Update inserted spot by before move event
        const spotDuration = dayjs(inserted.end).diff(inserted.start, 'minute')
        inserted.start = beforeMoveEnd.toDate()
        inserted.end = beforeMoveEnd.add(spotDuration, 'minute').toDate()
      }

      let afterMoveId: string | null = null
      if (orgTo) {
        // 移動したスポットから直後のスポットへの MoveEvent を追加する
        const org = [{ placeId: inserted.id }]
        const dest = [{ placeId: orgTo }]

        const result = await distanceMatrix.search(org, dest)

        const moveStart = dayjs(inserted.end)
        const moveEnd = moveStart.add(
          result.rows[0].elements[0].duration.value,
          's'
        )
        const moveEndChange = moveEnd.diff(orgMoveEnd, 'minute')

        const moveEvent: MoveEvent = {
          id: createEventId(),
          title: 'Car',
          start: moveStart.toDate(),
          end: moveEnd.toDate(),
          color: 'white',
          display: 'background',
          extendedProps: {
            type: 'move',
            from: org[0].placeId,
            to: dest[0].placeId,
          },
        }

        actions.push(moveEvent)
        afterMoveId = moveEvent.id

        const applyChange = (move: MoveEvent) => {
          const afterEvent = places.find(
            (spot): spot is SpotEvent => spot.id === move.extendedProps.to
          )
          console.log(afterEvent)
          if (afterEvent) {
            update({
              ...afterEvent,
              start: dayjs(afterEvent.start)
                .add(moveEndChange, 'minute')
                .toDate(),
              end: dayjs(afterEvent.end).add(moveEndChange, 'minute').toDate(),
              extendedProps: {
                ...afterEvent.extendedProps,
                from: move.id,
              },
            })
            const moveFrom = places.find(
              (spot): spot is MoveEvent =>
                spot.extendedProps.type === 'move' &&
                spot.extendedProps.from === afterEvent?.id
            )
            if (moveFrom) {
              update({
                ...moveFrom,
                start: dayjs(moveFrom.start)
                  .add(moveEndChange, 'minute')
                  .toDate(),
                end: dayjs(moveFrom.end).add(moveEndChange, 'minute').toDate(),
              })
              applyChange(moveFrom)
            }
          }
        }

        applyChange(moveEvent)
      }

      actions.update((spot) => spot.id === inserted.id, {
        ...inserted,
        extendedProps: {
          ...inserted.extendedProps,
          from: beforeMoveId,
          to: afterMoveId,
        },
      })
    },
    [actions, distanceMatrix, places, update]
  )

  return [places, { add, insert, remove, update }] as const
}
