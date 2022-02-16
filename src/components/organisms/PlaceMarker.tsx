import React from 'react'
import { Marker } from '@react-google-maps/api'

type Props = {
  placeId: string
  lat: number
  lng: number
  onClick: (placeId: string) => void
}
const PlaceMarker: React.FC<Props> = ({ placeId, lat, lng, onClick }) => {
  const handleClick = () => {
    onClick(placeId)
  }
  return <Marker position={{ lat, lng }} onClick={handleClick}></Marker>
}

export default PlaceMarker
