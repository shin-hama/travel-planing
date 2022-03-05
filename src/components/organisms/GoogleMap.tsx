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
  height: '100%',
}
const libs: 'places'[] = ['places']

const DEFAULT_CENTER = { lat: 36.5941035450526, lng: 138.70038569359122 }

export type Bounds = {
  sw?: google.maps.LatLng | null
  ne?: google.maps.LatLng | null
}
type Props = {
  center?: google.maps.LatLngLiteral | google.maps.LatLng
  zoom?: number
  setMapBounds: React.Dispatch<React.SetStateAction<Bounds>>
}
const GoogleMap: React.FC<Props> = React.memo(function Map({
  center: defaultCenter = DEFAULT_CENTER,
  zoom: defaultZoom = 4,
  setMapBounds,
  children,
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
    libraries: libs,
    // ...otherOptions
  })

  const [center, setCenter] = React.useState(defaultCenter)
  const [zoom, setZoom] = React.useState(defaultZoom)
  const [googleMap, setGoogleMap] = React.useState<google.maps.Map | null>(null)
  const setDirectionService = React.useContext(SetDirectionServiceContext)
  const setDistanceMatrix = React.useContext(SetDistanceMatrixContext)
  const setPlaces = React.useContext(SetPlacesServiceContext)

  const handleIdled = () => {
    if (googleMap) {
      setCenter((prev) => googleMap.getCenter() || prev)
      setZoom((prev) => googleMap.getZoom() || prev)

      const bounds = googleMap.getBounds()
      setMapBounds({ ne: bounds?.getNorthEast(), sw: bounds?.getSouthWest() })
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
    setMapBounds({ ne: bounds?.getNorthEast(), sw: bounds?.getSouthWest() })

    setGoogleMap(mapInstance)
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
      center={center}
      zoom={zoom}
      onIdle={handleIdled}
      onLoad={onLoad}>
      {/* Child components, such as markers, info windows, etc. */}
      {children}
    </GoogleMapLib>
  )
})

export default GoogleMap
