import React from 'react'
import { Marker } from '@react-google-maps/api'
import { useSelectedPlacesActions } from 'contexts/SelectedPlacesProvider'

type Props = {
  name: string
  placeId?: string
  lat: number
  lng: number
}
const PlaceMarker: React.FC<Props> = ({ name, placeId = 'none', lat, lng }) => {
  const { push } = useSelectedPlacesActions()
  const handleClick = () => {
    push({ name: name })
  }
  return <Marker position={{ lat, lng }} onClick={handleClick}></Marker>
}

export default PlaceMarker
