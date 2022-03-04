import * as React from 'react'

import { DirectionServiceContext } from 'contexts/DirectionServiceProvider'

export const useDirections = () => {
  const direction = React.useContext(DirectionServiceContext)

  /**
   * 入力されたスポットの一覧について、最適なルートを見つける
   * @param placeIds PlaceID のリスト
   */
  const search = React.useCallback(
    async (props: google.maps.DirectionsRequest) => {
      if (direction === null) {
        throw Error('JS Google Map api is not loaded')
      }

      const result = await direction.route(
        {
          ...props,
          optimizeWaypoints: true,
          region: 'JP',
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
