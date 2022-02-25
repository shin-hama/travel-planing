import * as React from 'react'
import dayjs from 'dayjs'

import {
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

const findLastSpot = (spots: SpotEvent[]) => {
  let max = spots[0]
  for (let i = 1; i < spots.length; i++) {
    const end = spots[i].end
    if (max.end && end !== null && max.end < end) {
      max = spots[i]
    }
  }

  return max
}

export const useSelectSpots = () => {
  const places = React.useContext(SelectedPlacesContext)
  const actions = useSelectedPlacesActions()
  const distanceMatrix = useDistanceMatrix()
  const [getSpot] = useGetSpotByPkLazyQuery()

  const add = React.useCallback(
    async (newSpot: Required<Spot>) => {
      // Create new spot event
      let start = dayjs('09:00:00', 'HH:mm:ss')
      if (Object.keys(places).length > 0) {
        // 現在セットされている最後のイベントから新規スポットまでの道のりを計算
        const lastSpot = findLastSpot(Object.values(places))
        const org = [{ placeId: lastSpot.extendedProps?.placeId }]
        start = dayjs(lastSpot.end)
        const dest = [{ placeId: newSpot.placeId }]
        const result = await distanceMatrix.search(org, dest)

        const moveEnd = start.add(
          result.rows[0].elements[0].duration.value,
          's'
        )

        if (moveEnd.hour() >= 19) {
          // 時刻がlimit を超えた場合は Move イベントはスキップして次の日へ移行する
          start = start.add(1, 'day').hour(9).minute(0).second(0)
        } else {
          const moveEvent = {
            id: createEventId(),
            title: 'Car',
            start: start.toDate(),
            end: moveEnd.toDate(),
            color: 'limegreen',
            display: 'background',
          }

          actions.set(moveEvent.id, moveEvent)
          start = moveEnd
        }
      }

      const spot = await getSpot({
        variables: { place_id: newSpot.placeId },
      })

      const spotEnd = start.add(1, 'hour')
      const spotEvent = {
        id: createEventId(),
        title: spot.data?.spots_by_pk?.name || '',
        start: start.toDate(),
        end: spotEnd.toDate(),
        color: 'transparent',
        extendedProps: {
          placeId: spot.data?.spots_by_pk?.place_id,
          imageUrl: newSpot.imageUrl,
        },
      }
      console.log(spotEvent)

      actions.set(spotEvent.id, spotEvent)
    },
    [actions, distanceMatrix, getSpot, places]
  )

  const remove = React.useCallback(
    (placeId: string) => {
      actions.remove(placeId)
    },
    [actions]
  )

  const update = React.useCallback(
    (newSpot: SpotEvent) => {
      actions.set(newSpot.id, newSpot)
    },
    [actions]
  )

  return [places, { add, remove, update }] as const
}
