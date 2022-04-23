import React from 'react'
import {
  GoogleMap as GoogleMapLib,
  useLoadScript,
} from '@react-google-maps/api'

import { googleMapConfigs } from 'configs'
import { SetDirectionServiceContext } from 'contexts/DirectionServiceProvider'
import { SetDistanceMatrixContext } from 'contexts/DistanceMatrixProvider'
import { SetPlacesServiceContext } from 'contexts/PlacesServiceProvider'
import { useMapProps } from 'hooks/googlemaps/useMapProps'
import { useTravelPlan } from 'hooks/useTravelPlan'

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
  const [plan] = useTravelPlan()

  const [mapProps, setMapProps] = useMapProps()

  const [googleMap, setGoogleMap] = React.useState<google.maps.Map | null>(null)
  const setDirectionService = React.useContext(SetDirectionServiceContext)
  const setDistanceMatrix = React.useContext(SetDistanceMatrixContext)
  const setPlaces = React.useContext(SetPlacesServiceContext)

  React.useEffect(() => {
    return () => {
      setMapProps((prev) => ({
        ...prev,
        mounted: false,
      }))
    }
  }, [setMapProps])

  /**
   * マップ操作が終了したタイミングで、center などのプロパティを更新する
   */
  const handleIdled = () => {
    if (googleMap) {
      setMapProps((prev) => ({
        center: googleMap.getCenter() || prev.center,
        zoom: googleMap.getZoom() || prev.zoom,
        bounds: googleMap.getBounds() || prev.bounds,
        mounted: true,
      }))
    }
  }

  // wrapping to a function is useful in case you want to access `window.google`
  // to eg. setup options or create latLng object, it won't be available otherwise
  // feel free to render directly if you don't need that
  const handleLoad = (mapInstance: google.maps.Map) => {
    // do something with map Instance
    setDirectionService(new window.google.maps.DirectionsService())
    setDistanceMatrix(new window.google.maps.DistanceMatrixService())
    setPlaces(new window.google.maps.places.PlacesService(mapInstance))

    setGoogleMap(mapInstance)
    onLoad?.(mapInstance)
  }

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

  if (loadError) {
    console.log('Error has occurred when loading google map')
  }

  if (isLoaded === false) {
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
