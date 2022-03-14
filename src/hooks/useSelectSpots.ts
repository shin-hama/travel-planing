import * as React from 'react'
import dayjs from 'dayjs'

import {
  MoveEvent,
  ScheduleEvent,
  ScheduleEventsContext,
  SpotDTO,
  SpotEvent,
  useScheduleEventsActions,
} from 'contexts/ScheduleEventsProvider'
import { useDistanceMatrix } from './googlemaps/useDistanceMatrix'
import { useGetSpotByPkLazyQuery } from 'generated/graphql'
import { useDirections } from './googlemaps/useDirections'
import { useEventFactory } from './useEventFactory'
import { usePlan } from './usePlan'

export const useSelectSpots = () => {
  const [currentPlan, planActions] = usePlan()
  const events = React.useContext(ScheduleEventsContext)
  const eventsRef = React.useRef<ScheduleEvent[]>([])
  eventsRef.current = events
  const listActions = useScheduleEventsActions()
  const distanceMatrix = useDistanceMatrix()
  const { actions: directionService } = useDirections()
  const { create: buildEvent, isSpotEvent, isMoveEvent } = useEventFactory()

  const [getSpot] = useGetSpotByPkLazyQuery()

  const commitEventsChange = React.useCallback(async () => {
    if (currentPlan) {
      planActions.update({ events: eventsRef.current })
    }
  }, [currentPlan, planActions])

  const get = React.useCallback(
    <T extends ScheduleEvent>(id: string, type: T['extendedProps']['type']) => {
      return eventsRef.current.find(
        (event): event is T =>
          event.id === id && event.extendedProps.type === type
      )
    },
    []
  )

  const getPrevSpot = React.useCallback(
    (current: ScheduleEvent): SpotEvent | null => {
      const prev = listActions.prev(current)

      if (!prev) {
        return null
      }

      if (isSpotEvent(prev)) {
        return prev
      } else if (isMoveEvent(prev)) {
        return getPrevSpot(prev)
      } else {
        throw Error(`not implemented type event error: ${prev}`)
      }
    },
    [isMoveEvent, isSpotEvent, listActions]
  )

  const getNextSpot = React.useCallback(
    (current: ScheduleEvent): SpotEvent | null => {
      const next = listActions.next(current)

      if (!next) {
        return null
      }

      if (isSpotEvent(next)) {
        return next
      } else if (isMoveEvent(next)) {
        return getNextSpot(next)
      } else {
        throw Error(`not implemented type event error: ${next}`)
      }
    },
    [isMoveEvent, isSpotEvent, listActions]
  )

  const getDestinations = React.useCallback(() => {
    return eventsRef.current.filter(
      (event): event is SpotEvent =>
        event.extendedProps.type === 'spot' &&
        event.extendedProps.placeId !== currentPlan?.home?.placeId
    )
  }, [currentPlan?.home?.placeId])

  const update = React.useCallback(
    async (newEvent: ScheduleEvent) => {
      listActions.update(newEvent)
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

  const swap = React.useCallback(
    async (front: SpotEvent, rear: SpotEvent) => {
      const moveFromRear = rear.extendedProps.to
        ? get<MoveEvent>(rear.extendedProps.to, 'move')
        : null
      const moveToRear = rear.extendedProps.from
        ? get<MoveEvent>(rear.extendedProps.from, 'move')
        : null

      const prevFrontSpot = getPrevSpot(front)

      // 前のスポットへの移動イベントを取得
      const moveToFrontSpot = front.extendedProps.from
        ? get<MoveEvent>(front.extendedProps.from, 'move')
        : null

      if (prevFrontSpot && moveToFrontSpot) {
        // 前のスポットへの移動イベントを後のスポットへの移動イベントに更新
        const org = [{ placeId: prevFrontSpot.extendedProps.placeId }]
        const dest = [{ placeId: rear.extendedProps.placeId }]
        const result = await distanceMatrix.search(org, dest)

        moveToFrontSpot.end = dayjs(moveToFrontSpot.start)
          .add(result.rows[0].elements[0].duration.value, 's')
          .toDate()
        moveToFrontSpot.extendedProps.to = rear.extendedProps.placeId
        update({ ...moveToFrontSpot })
      }

      // 選択中のスポットイベントを直前のスポットイベントと入れ替える
      const duration = dayjs(rear.end).diff(rear.start, 'minute')
      const newStart = moveToFrontSpot ? moveToFrontSpot.end : front.start
      const newEnd = dayjs(newStart).add(duration, 'minute')
      update({
        ...rear,
        start: newStart,
        end: newEnd.toDate(),
        extendedProps: {
          ...rear.extendedProps,
          from: front.extendedProps.from,
          to: front.extendedProps.to,
        },
      })

      if (moveToRear) {
        // 移動イベントを入れ替えたスポットイベントに合わせて更新する
        const moveDuration = dayjs(moveToRear.end).diff(
          moveToRear.start,
          'minute'
        )
        moveToRear.start = newEnd.toDate()
        moveToRear.end = newEnd.add(moveDuration, 'minute').toDate()
        update({
          ...moveToRear,
          extendedProps: {
            ...moveToRear.extendedProps,
            from: rear.id,
            to: front.id,
          },
        })
      }

      // 入れ替える対象になる直前のイベントを更新する
      const beforeDuration = dayjs(front.end).diff(front.start, 'minute')
      front.start = moveToRear?.end || rear.start
      front.end = dayjs(front.start).add(beforeDuration, 'minute').toDate()
      update({
        ...front,
        extendedProps: {
          ...front.extendedProps,
          from: moveToRear?.id || rear.id,
          to: rear.extendedProps.to,
        },
      })

      const afterRearSpot = getNextSpot(rear)
      // 選択したイベントより後のイベントを更新する
      if (afterRearSpot && moveFromRear) {
        const org = [{ placeId: front.extendedProps.placeId }]
        const dest = [{ placeId: afterRearSpot.extendedProps.placeId }]
        const result = await distanceMatrix.search(org, dest)

        moveFromRear.start = front.end
        const newMoveEnd = dayjs(moveFromRear.start).add(
          result.rows[0].elements[0].duration.value,
          's'
        )
        const moveEndChange = newMoveEnd.diff(moveFromRear.end, 'minute')
        moveFromRear.end = newMoveEnd.toDate()
        moveFromRear.extendedProps.from = front.id
        update({ ...moveFromRear })

        // Move イベントをたどって時刻の変更を適用する
        applyChange(moveFromRear, moveEndChange)
      }
    },
    [applyChange, distanceMatrix, get, getNextSpot, getPrevSpot, update]
  )

  const generateRoute = React.useCallback(
    async (selectedSpots: Array<SpotDTO>) => {
      if (!currentPlan?.home) {
        console.error('home is not selected')
        return
      }

      // 既存ルートを初期化する
      listActions.clear()

      const result = await directionService.search({
        origin: {
          placeId: currentPlan.home.placeId,
        },
        destination: {
          placeId: currentPlan.home.placeId,
        },
        waypoints: selectedSpots.map((spot) => ({
          location: {
            placeId: spot.placeId,
          },
        })),
        travelMode: google.maps.TravelMode.DRIVING,
      })

      if (result.routes.length === 0) {
        console.error('Cannot find route')
      }
      // Event をクリアしてから、最適化された順番で再登録する
      const route = result.routes[0]
      const startEvent = await buildEvent({
        type: 'spot',
        params: {
          id: 'start',
          title: currentPlan.home.name,
          start: dayjs('08:30:00', 'HH:mm:ss').toDate(),
          end: dayjs('09:00:00', 'HH:mm:ss').toDate(),
          props: {
            placeId: currentPlan.home.placeId,
            imageUrl: currentPlan.home.imageUrl,
          },
          eventProps: {
            durationEditable: false,
          },
        },
      })
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
        const moveEvent = await buildEvent({
          type: 'move',
          params: {
            start: last.end,
            end: moveEnd.toDate(),
          },
        })
        listActions.push(moveEvent)

        const { data: spot } = await getSpot({
          variables: { place_id: selectedSpots[waypointIndex].placeId },
        })
        if (spot?.spots_by_pk) {
          const spotEnd = moveEnd.add(1, 'hour')
          const spotEvent = await buildEvent({
            type: 'spot',
            params: {
              id: spot.spots_by_pk.place_id,
              title: spot.spots_by_pk.name,
              start: moveEnd.toDate(),
              end: spotEnd.toDate(),
              props: {
                placeId: spot.spots_by_pk.place_id,
                imageUrl: selectedSpots[waypointIndex].imageUrl,
              },
            },
          })

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
      const moveToEnd = await buildEvent({
        type: 'move',
        params: {
          start: last.end,
          end: moveEnd.toDate(),
        },
      })
      listActions.push(moveToEnd)

      const endEvent = await buildEvent({
        type: 'spot',
        params: {
          id: 'end',
          title: currentPlan.home.name,
          start: moveToEnd.end,
          end: dayjs(moveToEnd.end).add(30, 'minute').toDate(),
          props: {
            placeId: currentPlan.home.placeId,
            imageUrl: currentPlan.home.imageUrl,
          },
          eventProps: {
            durationEditable: false,
          },
        },
      })
      listActions.push(endEvent)

      commitEventsChange()
    },
    [
      buildEvent,
      commitEventsChange,
      currentPlan?.home,
      directionService,
      getSpot,
      listActions,
    ]
  )

  const remove = React.useCallback(
    async (removed: ScheduleEvent) => {
      try {
        listActions.remove(removed.id)

        if (removed.extendedProps.type === 'spot') {
          const afterMove = removed.extendedProps.to
            ? get<MoveEvent>(removed.extendedProps.to, 'move')
            : null
          if (afterMove) {
            listActions.remove(afterMove.id)
          }

          // update before move
          const beforeMove = removed.extendedProps.from
            ? get<MoveEvent>(removed.extendedProps.from, 'move')
            : null

          const beforeSpot = getPrevSpot(removed)
          const afterSpot = getNextSpot(removed)
          if (beforeMove) {
            if (afterSpot && beforeSpot) {
              // Calc distance between prev and next spot
              if (afterSpot) {
                afterSpot.extendedProps.from = beforeMove.id
                update({ ...afterSpot })
              }
              beforeMove.extendedProps.to = afterSpot.id

              const org = [{ placeId: beforeSpot.extendedProps.placeId }]
              const dest = [{ placeId: afterSpot.extendedProps.placeId }]
              const result = await distanceMatrix.search(org, dest)

              const newMoveEnd = dayjs(beforeMove.start).add(
                result.rows[0].elements[0].duration.value,
                's'
              )
              const moveEndChange = newMoveEnd.diff(afterSpot.start, 'minute')
              beforeMove.end = newMoveEnd.toDate()

              update({ ...beforeMove })

              applyChange(beforeMove, moveEndChange)
            } else {
              listActions.remove(beforeMove.id)
            }
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        await commitEventsChange()
      }
    },
    [
      listActions,
      get,
      getPrevSpot,
      getNextSpot,
      distanceMatrix,
      update,
      applyChange,
      commitEventsChange,
    ]
  )

  const insert = React.useCallback(
    async (inserted: SpotEvent) => {
      try {
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
            const beforeMoveEvent = await buildEvent({
              type: 'move',
              params: {
                start: prevSpot.end,
                end: beforeMoveEnd.toDate(),
              },
            })
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

          const moveEvent = await buildEvent({
            type: 'move',
            params: {
              start: moveStart.toDate(),
              end: moveEnd.toDate(),
            },
          })

          listActions.push(moveEvent)
          afterMoveId = moveEvent.id

          isMoveEvent(moveEvent) && applyChange(moveEvent, moveEndChange)
        }

        update({
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
        await commitEventsChange()
      }
    },
    [
      update,
      commitEventsChange,
      distanceMatrix,
      buildEvent,
      listActions,
      isMoveEvent,
      applyChange,
    ]
  )

  const init = React.useCallback(() => {
    listActions.clear()
  }, [listActions])

  const actions = React.useMemo(
    () => ({
      init,
      get,
      getPrevSpot,
      getNextSpot,
      getDestinations,
      insert,
      remove,
      update,
      generateRoute,
      applyChange,
      swap,
      commit: commitEventsChange,
    }),
    [
      applyChange,
      commitEventsChange,
      generateRoute,
      get,
      getDestinations,
      getNextSpot,
      getPrevSpot,
      init,
      insert,
      remove,
      swap,
      update,
    ]
  )

  return actions
}
