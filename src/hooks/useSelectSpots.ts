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

  const add = React.useCallback(
    async (newSpot: Required<Omit<Spot, 'type'>>, prevPlaceId?: string) => {
      let start = dayjs('09:00:00', 'HH:mm:ss')

      const lastSpot = findLastSpot(places)
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
          start = start.add(1, 'day').hour(9).minute(0).second(0)
        } else {
          const moveEvent: MoveEvent = {
            id: createEventId(),
            title: 'Car',
            start: moveStart.toDate(),
            end: moveEnd.toDate(),
            color: 'limegreen',
            display: 'background',
            extendedProps: {
              type: 'move',
              from: prevPlaceId || lastSpot.extendedProps.placeId,
              to: newSpot.placeId,
            },
          }
          actions.push(moveEvent)
          start = moveEnd
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
        },
      }
      console.log(spotEvent)

      actions.push(spotEvent)
    },
    [actions, distanceMatrix, getSpot, places]
  )

  const remove = React.useCallback(
    (eventId: string) => {
      actions.filter((spot) => spot.id !== eventId)
    },
    [actions]
  )

  const update = React.useCallback(
    (newSpot: ScheduleEvent) => {
      actions.update((spot) => spot.id === newSpot.id, newSpot)
    },
    [actions]
  )

  return [places, { add, remove, update }] as const
}
