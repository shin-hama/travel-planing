import * as React from 'react'
import dayjs from 'dayjs'

import { DirectionServiceContext } from 'contexts/DirectionServiceProvider'

export const useDirections = () => {
  const direction = React.useContext(DirectionServiceContext)

  /**
   * 入力されたスポットの一覧について、最適なルートを見つける
   * @param placeIds PlaceID のリスト
   */
  const search = React.useCallback(
    async (homeId: string, waypoints?: Array<string>) => {
      if (direction === null) {
        throw Error('JS Google Map api is not loaded')
      }

      const origin = { placeId: homeId }
      const destination = { placeId: homeId }

      const result = await direction.route(
        {
          origin,
          destination,
          waypoints: waypoints?.map((placeId) => ({
            location: { placeId: placeId },
          })),
          optimizeWaypoints: true,
          region: 'JP',
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: dayjs('09:00:00', 'HH:mm:ss').toDate(),
          },
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            console.log('finish search direction')
          } else {
            console.error(`Fail to search directions: ${status}`)
            throw new Error(`Fail to search directions: ${status}`)
          }
        }
      )
      return result
    },
    [direction]
  )

  return { search }
}
