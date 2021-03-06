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

const containerStyle = {
  width: '100%',
  height: '100%',
}

const libs: 'places'[] = ['places']

type Props = {
  onLoad?: (map: google.maps.Map) => void
  onClick: (e?: google.maps.MapMouseEvent) => void
}
const GoogleMap: React.FC<Props> = React.memo(function Map({
  children,
  onLoad,
  onClick,
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapConfigs.apiKey,
    libraries: libs,
    // ...otherOptions
  })

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
      onDragStart={() => onClick()}
      onClick={onClick}
      onIdle={handleIdled}
      onLoad={handleLoad}>
      {children}
    </GoogleMapLib>
  )
})

export default GoogleMap
