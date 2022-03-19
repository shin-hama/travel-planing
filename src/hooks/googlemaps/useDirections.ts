import * as React from 'react'

import { DirectionServiceContext } from 'contexts/DirectionServiceProvider'

export const useDirections = () => {
  const direction = React.useContext(DirectionServiceContext)
  const [loading, setLoading] = React.useState(false)

  const directionService = React.useMemo(
    () => ({
      actions: {
        isLoaded: direction !== null,
        /**
         * 入力されたスポットの一覧について、最適なルートを見つける
         * @param props PlaceID のリスト
         */
        search: async (props: google.maps.DirectionsRequest) => {
          if (direction === null) {
            throw Error('JS Google Map api is not loaded')
          }
          try {
            setLoading(true)

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
                  console.error(
                    `Fail to search directions: ${JSON.stringify(props)}`
                  )
                  throw new Error(`Fail to search directions: ${status}`)
                }
              }
            )
            console.log(result)
            return result
          } finally {
            setLoading(false)
          }
        },
      },
      loading,
    }),
    [direction, loading]
  )

  return directionService
}
