import * as React from 'react'
import { TravelMode } from './useDirections'

const BASE_URL = 'https://www.google.com/maps/dir/?api=1'

// Google Map API に依存させないために型情報を定義
type LatLng = {
  lat: number
  lng: number
}

export const useOpenMap = () => {
  const withDirections = React.useCallback(
    (origin: LatLng, destination: LatLng, mode: TravelMode) => {
      const org = `origin=${origin.lat},${origin.lng}`
      const dest = `destination=${destination.lat},${destination.lng}`
      const travelMode = `travelmode=${mode}`

      return [BASE_URL, org, dest, travelMode].join('&')
    },
    []
  )

  return withDirections
}
