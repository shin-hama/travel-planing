import React from 'react'
import { Marker } from '@react-google-maps/api'

type Props = {
  lat: number
  lng: number
}
const PlaceMarker: React.FC<Props> = ({ lat, lng }) => {
  console.log({ lat, lng })
  return <Marker position={{ lat, lng }}></Marker>
}

export default PlaceMarker
