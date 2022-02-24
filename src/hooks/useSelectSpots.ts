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

const createEvent = (e: SpotEvent): SpotEvent => {
  return {
    id: createEventId(),
    ...e,
  }
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
      if (places.length > 0) {
        // 現在セットされている最後のイベントから新規スポットまでの道のりを計算
        const prevSpot = places[places.length - 1]
        const org = [{ placeId: prevSpot.placeId }]
        start = dayjs(prevSpot.end)
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
          const moveEvent = createEvent({
            title: 'Car',
            start: start.toDate(),
            end: moveEnd.toDate(),
            color: 'limegreen',
            display: 'background',
            overlap: false,
          })

          actions.push(moveEvent)
          start = moveEnd
        }
      }

      const spot = await getSpot({
        variables: { place_id: newSpot.placeId },
      })

      const spotEnd = start.add(1, 'hour')
      const spotEvent = createEvent({
        title: spot.data?.spots_by_pk?.name || '',
        start: start.toDate(),
        end: spotEnd.toDate(),
        color: 'transparent',
        placeId: spot.data?.spots_by_pk?.place_id,
        imageUrl: newSpot.imageUrl,
      })

      actions.push(spotEvent)
    },
    [actions, distanceMatrix, getSpot, places]
  )

  return [places, { add }] as const
}
