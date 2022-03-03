import * as React from 'react'

import { DirectionServiceContext } from 'contexts/DirectionServiceProvider'

export const useDirections = () => {
  const direction = React.useContext(DirectionServiceContext)

  /**
   * 入力されたスポットの一覧について、最適なルートを見つける
   * @param placeIds PlaceID のリスト
   */
  const search = React.useCallback(
    async (homeId: string, waypoints: Array<string>) => {
      if (direction === null) {
        throw Error('JS Google Map api is not loaded')
      }
      if (waypoints.length < 2) {
        console.error('the minimum length is 2')
      }

      const origin = { placeId: homeId }
      const destination = { placeId: homeId }

      const result = await direction.route(
        {
          origin,
          destination,
          waypoints: waypoints.map((placeId) => ({
            location: { placeId: placeId },
          })),
          optimizeWaypoints: true,
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
