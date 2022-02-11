import * as React from 'react'

import { Place } from 'contexts/SelectedPlacesProvider'
import { DistanceMatrixContext } from 'contexts/DistanceMatrixProvider'

export const useDistanceMatrix = () => {
  const distanceMatrix = React.useContext(DistanceMatrixContext)

  const search = React.useCallback(
    async (places: Array<Place>) => {
      if (distanceMatrix === null) {
        throw Error('JS Google Map api is not loaded')
      }
      if (places.length < 2) {
        console.error('the minimum length is 2')
      }
      const cloned = Array.from(places)

      const origins = cloned.map(place => ({ placeId: place.placeId }))
      const destinations = cloned.map(place => ({ placeId: place.placeId }))
      const result = await distanceMatrix.getDistanceMatrix(
        {
          origins,
          destinations,
          region: 'JP',
          travelMode: google.maps.TravelMode.DRIVING,
        },
        () => {
          console.log('finish directions')
        }
      )
      return result
    },
    [distanceMatrix]
  )

  return { search }
}
