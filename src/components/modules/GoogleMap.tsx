import React from 'react'
import {
  GoogleMap as GoogleMapLib,
  useLoadScript,
} from '@react-google-maps/api'

import { SetDirectionServiceContext } from 'contexts/DirectionServiceProvider'
import { SetDistanceMatrixContext } from 'contexts/DistanceMatrixProvider'
import { SetPlacesServiceContext } from 'contexts/PlacesServiceProvider'
import { useMapProps } from 'hooks/googlemaps/useMapProps'
import { usePlan } from 'hooks/usePlan'
import { googleMapConfigs } from 'configs'

const containerStyle = {
  width: '100%',
  height: '100%',
}

const libs: 'places'[] = ['places']

type Props = {
  onLoad?: (map: google.maps.Map) => void
}
const GoogleMap: React.FC<Props> = React.memo(function Map({
  children,
  onLoad,
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapConfigs.apiKey,
    libraries: libs,
    // ...otherOptions
  })
  const [plan] = usePlan()

  const [mapProps, setMapProps] = useMapProps()

  const [googleMap, setGoogleMap] = React.useState<google.maps.Map | null>(null)
  const setDirectionService = React.useContext(SetDirectionServiceContext)
  const setDistanceMatrix = React.useContext(SetDistanceMatrixContext)
  const setPlaces = React.useContext(SetPlacesServiceContext)

  /**
   * マップ操作が終了したタイミングで、center などのプロパティを更新する
   */
  const handleIdled = () => {
    if (googleMap) {
      const bounds = googleMap.getBounds()

      setMapProps((prev) => ({
        center: googleMap.getCenter() || prev.center,
        zoom: googleMap.getZoom() || prev.zoom,
        bounds: {
          ne: bounds?.getNorthEast(),
          sw: bounds?.getSouthWest(),
        },
      }))
    }
  }

  // wrapping to a function is useful in case you want to access `window.google`
  // to eg. setup options or create latLng object, it won't be available otherwise
  // feel free to render directly if you don't need that
  const handleLoad = (mapInstance: google.maps.Map) => {
    console.log('loaded')
    // do something with map Instance
    setDirectionService(new window.google.maps.DirectionsService())
    setDistanceMatrix(new window.google.maps.DistanceMatrixService())
    setPlaces(new window.google.maps.places.PlacesService(mapInstance))

    const bounds = mapInstance.getBounds()

    setMapProps((prev) => ({
      ...prev,
      bounds: {
        ne: bounds?.getNorthEast(),
        sw: bounds?.getSouthWest(),
      },
    }))

    setGoogleMap(mapInstance)
    onLoad?.(mapInstance)
  }

  React.useEffect(() => {
    // 選択しているプランの目的地を中心にする
    if (plan) {
      const { lat, lng, zoom } = plan.destination
      setMapProps((prev) => ({
        ...prev,
        center: { lat, lng },
        zoom: zoom,
      }))
    }
  }, [plan, setMapProps])

  if (loadError) {
    console.log('Error has occurred when loading google map')
  }

  if (isLoaded === false) {
    console.log('loading')
    return <>Now loading...</>
  }

  return (
    <GoogleMapLib
      mapContainerStyle={containerStyle}
      options={{
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false,
        keyboardShortcuts: false,
      }}
      center={mapProps.center}
      zoom={mapProps.zoom}
      onIdle={handleIdled}
      onLoad={handleLoad}>
      {/* Child components, such as markers, info windows, etc. */}
      {children}
    </GoogleMapLib>
  )
})

export default GoogleMap
