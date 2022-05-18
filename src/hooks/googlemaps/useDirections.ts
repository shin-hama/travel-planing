import * as React from 'react'

import { useAxios } from 'hooks/axios/useAxios'
import { bffConfigs } from 'configs'

const TravelModes = ['driving', 'walking', 'bicycling', 'transit']
export type TravelMode = 'driving' | 'walking' | 'bicycling' | 'transit'
export const isTravelMode = (value: unknown): value is TravelMode => {
  return typeof value === 'string' && TravelModes.includes(value)
}

type DirectionsRequest<
  T extends google.maps.LatLngLiteral,
  U extends google.maps.LatLngLiteral
> = {
  origin: T | U
  destination: T | U
  waypoints?: Array<T>
  mode: TravelMode
}

type Leg = {
  duration: {
    text: string
    value: number
  }
}

type Route<T extends google.maps.LatLngLiteral> = {
  legs: Array<Leg>
  ordered_waypoints: Array<T>
  waypoint_order: Array<number>
}

type DirectionsResult<T extends google.maps.LatLngLiteral> = {
  route?: Route<T> | null
  status: 'success' | 'failed'
  message: string
}

export const useDirections = () => {
  const { post } = useAxios()
  const [loading, setLoading] = React.useState(false)

  /**
   * 入力されたスポットの一覧について、最適なルートを見つける
   * @param {DirectionsRequest} props - リクエストに必要なオプション
   */
  const search = React.useCallback(
    async <
      T extends google.maps.LatLngLiteral,
      U extends google.maps.LatLngLiteral
    >(
      props: DirectionsRequest<T, U>
    ) => {
      try {
        setLoading(true)
        const result = await post<DirectionsResult<T>>(
          `${bffConfigs.url}/directions`,
          props
        )

        if (result.route) {
          return result.route
        } else {
          console.error(result.message)
          return null
        }
      } finally {
        setLoading(false)
      }
    },
    [post]
  )

  return { search, loading } as const
}
