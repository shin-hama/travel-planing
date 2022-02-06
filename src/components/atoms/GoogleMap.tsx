import React from 'react'
import {
  GoogleMap as GoogleMapLib,
  useLoadScript,
} from '@react-google-maps/api'

const containerStyle = {
  width: '400px',
  height: '400px',
}

const defaultCenter = { lat: 36.5941035450526, lng: 138.70038569359122 }

type Props = {
  center?: google.maps.LatLngLiteral
  zoom?: number
}
const GoogleMap: React.FC<Props> = ({
  center = defaultCenter,
  zoom = 4,
  children,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
    // ...otherOptions
  })

  if (loadError) {
    console.log('Error has occurred when loading google map')
  }

  return isLoaded ? (
    <GoogleMapLib
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}>
      {/* Child components, such as markers, info windows, etc. */}
      {children}
    </GoogleMapLib>
  ) : (
    <>Now Loading...</>
  )
}

export default GoogleMap
