import * as React from 'react'

import { DistanceMatrixContext } from 'contexts/DistanceMatrixProvider'

export const useDistanceMatrix = () => {
  const distanceMatrix = React.useContext(DistanceMatrixContext)

  const actions = React.useMemo(
    () => ({
      search: async (
        origins: Array<google.maps.Place>,
        destinations: Array<google.maps.Place>
      ) => {
        if (distanceMatrix === null) {
          throw Error('JS Google Map api is not loaded')
        }
        if ((origins.length === 0, destinations.length === 0)) {
          console.error('no places')
        }

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
    }),
    [distanceMatrix]
  )

  return actions
}
