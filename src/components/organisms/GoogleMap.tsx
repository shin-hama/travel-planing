import React from 'react'
import {
  GoogleMap as GoogleMapLib,
  useLoadScript,
} from '@react-google-maps/api'
import { SetDirectionServiceContext } from 'contexts/DirectionServiceProvider'
import { SetDistanceMatrixContext } from 'contexts/DistanceMatrixProvider'
import { SetPlacesServiceContext } from 'contexts/PlacesServiceProvider'

const containerStyle = {
  width: '100%',
  height: '100vh',
}

const defaultCenter = { lat: 36.5941035450526, lng: 138.70038569359122 }

const libs: 'places'[] = ['places']

type Props = {
  center?: google.maps.LatLngLiteral
  zoom?: number
}
const RenderMap: React.FC<Partial<Props>> = ({ center, zoom, children }) => {
  const setDirectionService = React.useContext(SetDirectionServiceContext)
  const setDistanceMatrix = React.useContext(SetDistanceMatrixContext)
  const setPlaces = React.useContext(SetPlacesServiceContext)

  // wrapping to a function is useful in case you want to access `window.google`
  // to eg. setup options or create latLng object, it won't be available otherwise
  // feel free to render directly if you don't need that
  const onLoad = React.useCallback(
    mapInstance => {
      // do something with map Instance
      setDirectionService(new window.google.maps.DirectionsService())
      setDistanceMatrix(new window.google.maps.DistanceMatrixService())
      setPlaces(new window.google.maps.places.PlacesService(mapInstance))
    },
    [setDirectionService, setDistanceMatrix, setPlaces]
  )

  return (
    <GoogleMapLib
      mapContainerStyle={containerStyle}
      options={{
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      }}
      center={center}
      zoom={zoom}
      onLoad={onLoad}>
      {/* Child components, such as markers, info windows, etc. */}
      {children}
    </GoogleMapLib>
  )
}

const GoogleMap: React.FC<Props> = ({
  center = defaultCenter,
  zoom = 4,
  children,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
    libraries: libs,
    // ...otherOptions
  })

  if (loadError) {
    console.log('Error has occurred when loading google map')
  }

  return isLoaded ? (
    <RenderMap center={center} zoom={zoom}>
      {/* Child components, such as markers, info windows, etc. */}
      {children}
    </RenderMap>
  ) : (
    <>Now Loading...</>
  )
}

export default GoogleMap
