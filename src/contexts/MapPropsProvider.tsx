import * as React from 'react'

import { usePlan } from 'hooks/usePlan'

const DEFAULT_CENTER = { lat: 36.5941035450526, lng: 138.70038569359122 }

type MapProps = {
  center: google.maps.LatLng | google.maps.LatLngLiteral
  zoom: number
  bounds: google.maps.LatLngBounds | null
  mounted: boolean
}
export const MapPropsContext = React.createContext<MapProps | null>(null)
export const SetMapPropsContext = React.createContext<
  React.Dispatch<React.SetStateAction<MapProps>>
>(() => {
  throw new Error('MapPropsProvider is not wrapped')
})

export const MapPropsProvider: React.FC = ({ children }) => {
  const [mapProps, setMapProps] = React.useState<MapProps>({
    center: DEFAULT_CENTER,
    zoom: 4,
    bounds: null,
    mounted: false,
  })

  const [plan] = usePlan()

  React.useEffect(() => {
    // 選択しているプランの目的地を中心にする
    if (plan?.destination) {
      const { lat, lng, zoom } = plan.destination
      setMapProps((prev) => ({
        ...prev,
        center: { lat, lng },
        zoom: zoom,
      }))
    }
  }, [plan?.destination, setMapProps])

  return (
    <MapPropsContext.Provider value={mapProps}>
      <SetMapPropsContext.Provider value={setMapProps}>
        {children}
      </SetMapPropsContext.Provider>
    </MapPropsContext.Provider>
  )
}
