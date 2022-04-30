import * as React from 'react'

import { DirectionServiceContext } from 'contexts/DirectionServiceProvider'
import { useAxios } from 'hooks/axios/useAxios'
import { bffConfigs } from 'configs'

type DirectionsRequest<
  T extends google.maps.LatLngLiteral,
  U extends google.maps.LatLngLiteral
> = {
  origin: T | U
  destination: T | U
  waypoints?: Array<T>
  mode: 'driving' | 'walking' | 'bicycling' | 'transit'
}

type Leg = {
  duration: {
    text: string
    value: number
  }
}

type DirectionsResult<T extends google.maps.LatLngLiteral> = {
  legs: Array<Leg>
  ordered_waypoints: Array<T>
  waypoint_order: Array<number>
}

export const useDirections = () => {
  const direction = React.useContext(DirectionServiceContext)
  const [loading, setLoading] = React.useState(false)
  const { post } = useAxios()

  const directionService = React.useMemo(
    () => ({
      actions: {
        isLoaded: direction !== null,
        /**
         * 入力されたスポットの一覧について、最適なルートを見つける
         * @param props PlaceID のリスト
         */
        search: async <
          T extends google.maps.LatLngLiteral,
          U extends google.maps.LatLngLiteral
        >(
          props: DirectionsRequest<T, U>
        ) => {
          try {
            setLoading(true)
            const result = await post<DirectionsResult<T>>(
              bffConfigs.url,
              props
            )

            console.log(result)
            return result
          } finally {
            setLoading(false)
          }
        },
        //   search: async (props: google.maps.DirectionsRequest) => {
        //     if (direction === null) {
        //       throw Error('JS Google Map api is not loaded')
        //     }
        //     try {
        //       setLoading(true)

        //       const result = await direction.route(
        //         {
        //           ...props,
        //           optimizeWaypoints: true,
        //           region: 'JP',
        //         },
        //         (result, status) => {
        //           if (status === google.maps.DirectionsStatus.OK) {
        //             console.log('finish search direction')
        //           } else {
        //             console.error(
        //               `Fail to search directions: ${JSON.stringify(props)}`
        //             )
        //             throw new Error(`Fail to search directions: ${status}`)
        //           }
        //         }
        //       )
        //       console.log(result)
        //       return result
        //     } finally {
        //       setLoading(false)
        //     }
        //   },
      },
      loading,
    }),
    [direction, loading, post]
  )

  return directionService
}
