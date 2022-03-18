import * as React from 'react'
import dayjs from 'dayjs'

import { useGetSpotByPkLazyQuery } from 'generated/graphql'
import { useDirections } from './googlemaps/useDirections'
import { useEventFactory } from './useEventFactory'
import { usePlan } from './usePlan'
import { useLinkedEvents } from './useLinkedEventList'

import { EventInput } from '@fullcalendar/react' // must go before plugins

export type SpotDTO = Required<Pick<Spot, 'placeId' | 'imageUrl'>>
export type Spot = {
  type: 'spot'
  placeId: string
  imageUrl: string
  from: string | null
  to: string | null
}
export type Move = {
  type: 'move'
  from: string
  to: string
  mode: 'bicycle' | 'car' | 'walk'
}
type CustomEventInput = Omit<EventInput, 'extendedProps'>
export type EventBase = CustomEventInput & {
  id: string
  start: Date
  end: Date
}
export type SpotEvent = EventBase & {
  extendedProps: Spot
}
export type MoveEvent = EventBase & {
  extendedProps: Move
}

export type ScheduleEvent = SpotEvent | MoveEvent

export const usePlanEvents = () => {
  const [currentPlan, planActions] = usePlan()
  const [events, eventsApi] = useLinkedEvents(currentPlan?.events)
  const eventsRef = React.useRef<ScheduleEvent[]>([])
  eventsRef.current = events
  const { actions: directionService } = useDirections()
  const { create: buildEvent, isSpotEvent, isMoveEvent } = useEventFactory()

  const [getSpot] = useGetSpotByPkLazyQuery()

  React.useEffect(() => {
    eventsApi.set(currentPlan?.events || [])
  }, [currentPlan?.events, eventsApi])

  const commitEventsChange = React.useCallback(async () => {
    if (currentPlan) {
      console.log('commit')
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
      const prev = eventsApi.prev(current)

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
    [isMoveEvent, isSpotEvent, eventsApi]
  )

  const getNextSpot = React.useCallback(
    (current: ScheduleEvent): SpotEvent | null => {
      const next = eventsApi.next(current)

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
    [isMoveEvent, isSpotEvent, eventsApi]
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
      eventsApi.update(newEvent)
    },
    [eventsApi]
  )

  const followMoving = React.useCallback(
    (target: ScheduleEvent, duration: number, unit: dayjs.ManipulateType) => {
      eventsRef.current
        .filter(
          (event) => dayjs(event.start).date() === dayjs(target.end).date()
        )
        .forEach((event) => {
          update({
            ...event,
            start: dayjs(event.start).add(duration, unit).toDate(),
            end: dayjs(event.end).add(duration, unit).toDate(),
          })
        })
    },
    [update]
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
        const origin = { placeId: prevFrontSpot.extendedProps.placeId }
        const destination = { placeId: rear.extendedProps.placeId }
        const result = await directionService.search({
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        })
        const route = result.routes.shift()
        if (route) {
          moveToFrontSpot.end = dayjs(moveToFrontSpot.start)
            .add(route.legs[0].duration?.value || 0, 'second')
            .toDate()
          moveToFrontSpot.extendedProps.to = rear.extendedProps.placeId
          update({ ...moveToFrontSpot })
        } else {
          console.warn('cannot find route')
        }
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
        const origin = { placeId: front.extendedProps.placeId }
        const destination = { placeId: afterRearSpot.extendedProps.placeId }
        const result = await directionService.search({
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        })
        const route = result.routes.shift()
        if (route) {
          moveFromRear.start = front.end
          const newMoveEnd = dayjs(moveFromRear.start).add(
            route.legs[0].duration?.value || 0,
            's'
          )
          const moveEndChange = newMoveEnd.diff(moveFromRear.end, 'minute')
          moveFromRear.end = newMoveEnd.toDate()
          moveFromRear.extendedProps.from = front.id
          update({ ...moveFromRear })

          // Move イベントをたどって時刻の変更を適用する
          applyChange(moveFromRear, moveEndChange)
        } else {
          console.warn('cannot find route')
        }
      }

      commitEventsChange()
    },
    [
      applyChange,
      commitEventsChange,
      directionService,
      get,
      getNextSpot,
      getPrevSpot,
      update,
    ]
  )

  const generateRoute = React.useCallback(
    async (selectedSpots: Array<SpotDTO>) => {
      if (!directionService.isLoaded) {
        console.error('google maps is not loaded')
        return
      }
      if (!currentPlan?.home) {
        console.error('home is not selected')
        return
      }

      // 既存ルートを初期化する
      eventsApi.clear()

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
      eventsApi.push(startEvent)

      for (const [i, waypointIndex] of route.waypoint_order.entries()) {
        const last = eventsApi.getLast()
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
        eventsApi.push(moveEvent)

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

          eventsApi.push(spotEvent)
        }
      }
      const last = eventsApi.getLast()
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
      eventsApi.push(moveToEnd)

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
      eventsApi.push(endEvent)

      commitEventsChange()
    },
    [
      buildEvent,
      commitEventsChange,
      currentPlan?.home,
      directionService,
      getSpot,
      eventsApi,
    ]
  )

  const remove = React.useCallback(
    async (removed: ScheduleEvent) => {
      try {
        eventsApi.remove(removed.id)

        if (removed.extendedProps.type === 'spot') {
          const beforeEvent = eventsApi.prev(removed)
          const afterEvent = eventsApi.next(removed)

          const beforeSpot = getPrevSpot(removed)
          const afterSpot = getNextSpot(removed)
          if (beforeEvent && isMoveEvent(beforeEvent)) {
            if (afterSpot && beforeSpot) {
              if (afterSpot.start.getDate() === beforeSpot.start.getDate()) {
                if (afterSpot) {
                  // Calc distance between prev and next spot
                  afterSpot.extendedProps.from = beforeEvent.id
                  update({ ...afterSpot })
                }
                beforeEvent.extendedProps.to = afterSpot.id

                const origin = { placeId: beforeSpot.extendedProps.placeId }
                const destination = { placeId: afterSpot.extendedProps.placeId }
                const result = await directionService.search({
                  origin,
                  destination,
                  travelMode: google.maps.TravelMode.DRIVING,
                })
                const route = result.routes.shift()
                const newMoveEnd = dayjs(beforeEvent.start).add(
                  route?.legs[0].duration?.value || 0,
                  's'
                )
                const moveEndChange = newMoveEnd.diff(afterSpot.start, 'minute')
                beforeEvent.end = newMoveEnd.toDate()

                update({ ...beforeEvent })

                applyChange(beforeEvent, moveEndChange)
              } else {
                eventsApi.remove(beforeEvent.id)
              }
            } else {
              eventsApi.remove(beforeEvent.id)
            }
          }

          if (afterEvent && isMoveEvent(afterEvent)) {
            eventsApi.remove(afterEvent.id)
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        await commitEventsChange()
      }
    },
    [
      eventsApi,
      getPrevSpot,
      getNextSpot,
      isMoveEvent,
      directionService,
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
          const beforeOrg = { placeId: prevSpot.extendedProps.placeId }
          const beforeDest = { placeId: inserted.extendedProps.placeId }
          const beforeResult = await directionService.search({
            origin: beforeOrg,
            destination: beforeDest,
            travelMode: google.maps.TravelMode.DRIVING,
          })
          const route = beforeResult.routes.shift()
          const beforeMoveEnd = dayjs(prevSpot.end).add(
            route?.legs[0].duration?.value || 0,
            'second'
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
            eventsApi.push(beforeMoveEvent)

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
          const origin = { placeId: inserted.extendedProps.placeId }
          const destination = { placeId: nextSpot.extendedProps.placeId }

          const result = await directionService.search({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
          })
          const route = result.routes.shift()

          const moveStart = dayjs(inserted.end)
          const moveEnd = moveStart.add(
            route?.legs[0].duration?.value || 0,
            'second'
          )
          const moveEndChange = moveEnd.diff(nextSpot.start, 'minute')

          const moveEvent = await buildEvent({
            type: 'move',
            params: {
              start: moveStart.toDate(),
              end: moveEnd.toDate(),
            },
          })

          eventsApi.push(moveEvent)
          afterMoveId = moveEvent.id

          isMoveEvent(moveEvent) && applyChange(moveEvent, moveEndChange)
        }
        console.log('finish insert')

        eventsApi.push({
          ...inserted,
          extendedProps: {
            ...inserted.extendedProps,
            from: beforeMoveId,
            to: afterMoveId,
          },
        })
        console.log('finish insert')
      } catch (e) {
        console.error(e)
      } finally {
        await commitEventsChange()
      }
    },
    [
      update,
      commitEventsChange,
      directionService,
      buildEvent,
      eventsApi,
      isMoveEvent,
      applyChange,
    ]
  )

  const init = React.useCallback(() => {
    eventsApi.clear()
  }, [eventsApi])

  const actions = React.useMemo(
    () => ({
      init,
      followMoving,
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
      followMoving,
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

  return [events, actions] as const
}
