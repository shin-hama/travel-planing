import * as React from 'react'
import dayjs from 'dayjs'

import {
  MoveEvent,
  ScheduleEvent,
  SelectedPlacesContext,
  Spot,
  SpotDTO,
  SpotEvent,
  useSelectedPlacesActions,
} from 'contexts/SelectedPlacesProvider'
import { useDistanceMatrix } from './useDistanceMatrix'
import { useGetSpotByPkLazyQuery } from 'generated/graphql'
import { SelectedPrefectureContext } from 'contexts/SelectedPrefectureProvider'
import { useDirections } from './useDirections'

let eventGuid = 0

function createEventId() {
  return String(eventGuid++)
}

const buildMoveEvent = (
  start: MoveEvent['start'],
  end: MoveEvent['end']
): MoveEvent => {
  return {
    id: createEventId(),
    title: 'Move',
    color: 'white',
    display: 'background',
    start,
    end,
    extendedProps: {
      type: 'move',
      mode: 'car',
      from: 'null',
      to: 'null',
    },
  }
}

const buildSpotEvent = (
  id: string,
  title: string,
  start: SpotEvent['start'],
  end: SpotEvent['end'],
  props: Pick<SpotEvent['extendedProps'], 'placeId' | 'imageUrl'>
): SpotEvent => {
  return {
    id: id,
    title,
    start: start,
    end: end,
    color: 'transparent',
    extendedProps: {
      type: 'spot',
      from: null,
      to: null,
      ...props,
    },
  }
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
  const scheduledEvents = React.useContext(SelectedPlacesContext)
  const eventsRef = React.useRef<ScheduleEvent[]>([])
  eventsRef.current = scheduledEvents
  const listActions = useSelectedPlacesActions()
  const distanceMatrix = useDistanceMatrix()
  const { actions: directionService } = useDirections()
  const { home } = React.useContext(SelectedPrefectureContext)

  const [loading, setLoading] = React.useState(false)

  const [getSpot] = useGetSpotByPkLazyQuery()

  const get = React.useCallback(
    <T extends ScheduleEvent>(id: string, type: T['extendedProps']['type']) => {
      return eventsRef.current.find(
        (event): event is T =>
          event.id === id && event.extendedProps.type === type
      )
    },
    []
  )

  const generateRoute = React.useCallback(
    async (selectedSpots: Array<SpotDTO>) => {
      if (!home) {
        console.error('home is not selected')
        return
      }

      const result = await directionService.search({
        origin: {
          placeId: home.place_id,
        },
        destination: {
          placeId: home.place_id,
        },
        waypoints: selectedSpots.map((spot) => ({
          location: {
            placeId: spot.placeId,
          },
        })),
        travelMode: google.maps.TravelMode.DRIVING,
      })
      console.log(result)

      if (result.routes.length === 0) {
        console.error('Cannot find route')
      }
      // Event をクリアしてから、最適化された順番で再登録する
      const route = result.routes[0]
      const startEvent = buildSpotEvent(
        'start',
        home.name,
        dayjs('08:00:00', 'HH:mm:ss').toDate(),
        dayjs('09:00:00', 'HH:mm:ss').toDate(),
        {
          placeId: home.place_id,
          imageUrl: '',
        }
      )
      listActions.push(startEvent)

      for (const [i, waypointIndex] of route.waypoint_order.entries()) {
        const last = listActions.getLast()
        if (last === null) {
          throw Error('event is not added')
        }
        const moveEnd = dayjs(last.end).add(
          route.legs[i].duration?.value || 0,
          'second'
        )
        const moveEvent = buildMoveEvent(last.end, moveEnd.toDate())
        listActions.push(moveEvent)

        const { data: spot } = await getSpot({
          variables: { place_id: selectedSpots[waypointIndex].placeId },
        })
        if (spot?.spots_by_pk) {
          const spotEnd = moveEnd.add(1, 'hour')
          const spotEvent = buildSpotEvent(
            spot.spots_by_pk.place_id,
            spot.spots_by_pk.name,
            moveEnd.toDate(),
            spotEnd.toDate(),
            {
              placeId: spot.spots_by_pk.place_id,
              imageUrl: selectedSpots[waypointIndex].imageUrl,
            }
          )

          listActions.push(spotEvent)
        }
      }
      const last = listActions.getLast()
      if (last === null) {
        throw Error('event is not added')
      }

      const moveEnd = dayjs(last.end).add(
        route.legs[route.legs.length - 1].duration?.value || 0,
        'second'
      )
      const moveToEnd = buildMoveEvent(last.end, moveEnd.toDate())
      listActions.push(moveToEnd)

      const endEvent = buildSpotEvent(
        'end',
        home.name,
        moveToEnd.end,
        dayjs(moveToEnd.end).add(1, 'hour').toDate(),
        {
          placeId: home.place_id,
          imageUrl: '',
        }
      )
      listActions.push(endEvent)
    },
    [directionService, getSpot, home, listActions]
  )

  const update = React.useCallback(
    (newSpot: ScheduleEvent) => {
      listActions.update(newSpot)
    },
    [listActions]
  )

  const applyChange = React.useCallback(
    (move: MoveEvent, changedMinutes: number) => {
      const afterEvent = eventsRef.current.find(
        (spot): spot is SpotEvent => spot.id === move.extendedProps.to
      )
      if (afterEvent) {
        update({
          ...afterEvent,
          start: dayjs(afterEvent.start).add(changedMinutes, 'minute').toDate(),
          end: dayjs(afterEvent.end).add(changedMinutes, 'minute').toDate(),
          extendedProps: {
            ...afterEvent.extendedProps,
            from: move.id,
          },
        })
        const moveFrom = eventsRef.current.find(
          (spot): spot is MoveEvent =>
            spot.extendedProps.type === 'move' &&
            spot.extendedProps.from === afterEvent?.id
        )
        if (moveFrom) {
          update({
            ...moveFrom,
            start: dayjs(moveFrom.start).add(changedMinutes, 'minute').toDate(),
            end: dayjs(moveFrom.end).add(changedMinutes, 'minute').toDate(),
          })
          applyChange(moveFrom, changedMinutes)
        }
      }
    },
    [update]
  )

  const add = React.useCallback(
    async (newSpot: Required<Pick<Spot, 'placeId' | 'imageUrl'>>) => {
      try {
        let start = dayjs('09:00:00', 'HH:mm:ss')

        const lastSpot = findLastSpot(eventsRef.current)
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
          if (moveEnd.isAfter(moveEnd.set('hour', 19).set('minute', 0))) {
            // 時刻がlimit を超えた場合は Move イベントはスキップして次の日へ移行する
            start = moveStart.add(1, 'day').hour(9).minute(0).second(0)
          } else {
            const moveEvent: MoveEvent = buildMoveEvent(
              moveStart.toDate(),
              moveEnd.toDate()
            )
            listActions.push(moveEvent)

            update({
              ...lastSpot,
              extendedProps: {
                ...lastSpot.extendedProps,
                to: moveEvent.id,
              },
            })
            start = moveEnd
          }
        }

        const spot = await getSpot({
          variables: { place_id: newSpot.placeId },
        })

        const spotEnd = start.add(1, 'hour')

        const spotEvent: SpotEvent = buildSpotEvent(
          newSpot.placeId,
          spot.data?.spots_by_pk?.name || '',
          start.toDate(),
          spotEnd.toDate(),
          {
            placeId: newSpot.placeId,
            imageUrl: newSpot.imageUrl,
          }
        )

        listActions.push(spotEvent)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    },
    [listActions, distanceMatrix, getSpot, update]
  )

  const remove = React.useCallback(
    async (removed: ScheduleEvent) => {
      try {
        setLoading(true)

        listActions.remove(removed)

        if (removed.extendedProps.type === 'spot') {
          const afterMove = eventsRef.current.find(
            (event): event is MoveEvent =>
              event.extendedProps.type === 'move' &&
              event.id === removed.extendedProps.to
          )
          if (afterMove) {
            remove(afterMove)
          }

          // update before move
          const beforeMove = eventsRef.current.find(
            (event): event is MoveEvent =>
              event.extendedProps.type === 'move' &&
              event.id === removed.extendedProps.from
          )

          if (beforeMove) {
            if (afterMove) {
              // Calc distance between prev and next spot
              beforeMove.extendedProps.to = afterMove.extendedProps.to

              const org = [{ placeId: beforeMove.extendedProps.from }]
              const dest = [{ placeId: beforeMove.extendedProps.to }]
              const result = await distanceMatrix.search(org, dest)

              const newMoveEnd = dayjs(beforeMove.start).add(
                result.rows[0].elements[0].duration.value,
                's'
              )
              const moveEndChange = newMoveEnd.diff(afterMove.end, 'minute')
              beforeMove.end = newMoveEnd.toDate()

              update({ ...beforeMove })

              applyChange(beforeMove, moveEndChange)
            } else {
              remove(beforeMove)
            }
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listActions, distanceMatrix, update]
  )

  const insert = React.useCallback(
    async (inserted: SpotEvent) => {
      try {
        setLoading(true)

        // Calc new schedule on moved date
        const destSpots = eventsRef.current.filter(
          (event): event is SpotEvent =>
            event.extendedProps.type === 'spot' &&
            dayjs(event.start).date() === dayjs(inserted.start).date()
        )

        const destPrevSpots = destSpots
          .filter((spot) => dayjs(spot.start) < dayjs(inserted.start))
          .sort((a, b) => dayjs(b.start).diff(a.start))
        const prevSpot = destPrevSpots.length > 0 ? destPrevSpots[0] : null

        const overlappedMoveEvent = eventsRef.current.find(
          (event): event is MoveEvent => event.id === prevSpot?.extendedProps.to
        )

        let beforeMoveId: string | null = null
        if (prevSpot) {
          // 直前のイベントから移動したスポットへの MoveEvent を追加する
          const beforeOrg = [{ placeId: prevSpot.id }]
          const beforeDest = [{ placeId: inserted.id }]
          const beforeResult = await distanceMatrix.search(
            beforeOrg,
            beforeDest
          )
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
            const beforeMoveEvent = buildMoveEvent(
              prevSpot.end,
              beforeMoveEnd.toDate()
            )
            listActions.push(beforeMoveEvent)

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
          const spotDuration = dayjs(inserted.end).diff(
            inserted.start,
            'minute'
          )
          inserted.start = beforeMoveEnd.toDate()
          inserted.end = beforeMoveEnd.add(spotDuration, 'minute').toDate()
        }

        let afterMoveId: string | null = null

        const destNextSpots = destSpots
          .filter((spot) => dayjs(spot.start) > dayjs(inserted.start))
          .sort((a, b) => dayjs(a.start).diff(b.start))
        const nextSpot = destNextSpots.length > 0 ? destNextSpots[0] : null
        if (nextSpot) {
          // 移動したスポットから直後のスポットへの MoveEvent を追加する
          const org = [{ placeId: inserted.id }]
          const dest = [{ placeId: nextSpot.id }]

          const result = await distanceMatrix.search(org, dest)

          const moveStart = dayjs(inserted.end)
          const moveEnd = moveStart.add(
            result.rows[0].elements[0].duration.value,
            's'
          )
          const moveEndChange = moveEnd.diff(nextSpot.start, 'minute')

          const moveEvent: MoveEvent = buildMoveEvent(
            moveStart.toDate(),
            moveEnd.toDate()
          )

          listActions.push(moveEvent)
          afterMoveId = moveEvent.id

          applyChange(moveEvent, moveEndChange)
        }

        listActions.update({
          ...inserted,
          extendedProps: {
            ...inserted.extendedProps,
            from: beforeMoveId,
            to: afterMoveId,
          },
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    },
    [listActions, applyChange, distanceMatrix, update]
  )

  const init = React.useCallback(() => {
    listActions.clear()
  }, [listActions])

  return {
    events: scheduledEvents,
    loading,
    actions: {
      add,
      init,
      get,
      insert,
      remove,
      update,
      generateRoute,
      applyChange,
    },
  }
}
