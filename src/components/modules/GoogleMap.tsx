import React from 'react'
import {
  GoogleMap as GoogleMapLib,
  useLoadScript,
  Marker,
} from '@react-google-maps/api'
import Box from '@mui/material/Box'

import { googleMapConfigs } from 'configs'
import { SetDirectionServiceContext } from 'contexts/DirectionServiceProvider'
import { SetDistanceMatrixContext } from 'contexts/DistanceMatrixProvider'
import { SetPlacesServiceContext } from 'contexts/PlacesServiceProvider'
import { useMapProps } from 'hooks/googlemaps/useMapProps'
import { useTravelPlan } from 'hooks/useTravelPlan'
import AnySpotCard from './AnySpotCard'

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

  const [anySpot, setAnyPlace] = React.useState<google.maps.LatLng | null>(null)

  const handleClick = (e: google.maps.MapMouseEvent) => {
    e.domEvent.preventDefault()
    if (anySpot) {
      setAnyPlace(null)
    } else {
      setAnyPlace(e.latLng)
    }
  }

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
      onClick={handleClick}
      onIdle={handleIdled}
      onLoad={handleLoad}>
      {/* Child components, such as markers, info windows, etc. */}
      {children}
      {anySpot && (
        <>
          <Marker position={anySpot} />
          <Box
            sx={{
              zIndex: 10,
              position: 'absolute',
              bottom: 25,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '400px',
              maxHeight: '150px',
            }}>
            <AnySpotCard lat={anySpot.lat()} lng={anySpot.lng()} />
          </Box>
        </>
      )}
    </GoogleMapLib>
  )
})

export default GoogleMap
