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

const GoogleMap: React.FC = React.memo(function Map({ children }) {
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
  const onLoad = (mapInstance: google.maps.Map) => {
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
  }

  React.useEffect(() => {
    if (plan) {
      const { lat, lng, zoom } = plan.destination
      setMapProps((prev) => ({
        ...prev,
        center: { lat, lng } || prev.center,
        zoom: zoom || prev.zoom,
      }))
    }
  }, [plan, setMapProps])

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
      onLoad={onLoad}>
      {/* Child components, such as markers, info windows, etc. */}
      {children}
    </GoogleMapLib>
  )
})

export default GoogleMap
