import * as React from 'react'

import { DirectionServiceContext } from 'contexts/DirectionServiceProvider'
import { Spot } from 'contexts/SelectedPlacesProvider'

export const useDirections = () => {
  const direction = React.useContext(DirectionServiceContext)

  const search = React.useCallback(
    async (places: Array<Spot>) => {
      if (direction === null) {
        throw Error('JS Google Map api is not loaded')
      }
      if (places.length < 2) {
        console.error('the minimum length is 2')
      }
      const cloned = Array.from(places)

      const origin = { placeId: cloned.shift()?.placeId }
      const destination = { placeId: cloned.pop()?.placeId }
      const waypoints = cloned.map(place => ({
        location: { placeId: place.placeId },
      }))
      const result = await direction.route(
        {
          origin,
          destination,
          waypoints,
          region: 'JP',
          travelMode: google.maps.TravelMode.DRIVING,
        },
        () => {
          console.log('finish search direction')
        }
      )
      return result
    },
    [direction]
  )

  return { search }
}
