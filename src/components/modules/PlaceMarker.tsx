import React from 'react'
import { Marker } from '@react-google-maps/api'
import { useSelectedSpots } from 'hooks/useSelectedSpots'

type Props = {
  placeId: string
  selected: boolean
  lat: number
  lng: number
  onClick: (placeId: string) => void
}
const PlaceMarker: React.FC<Props> = ({
  placeId,
  selected,
  lat,
  lng,
  onClick,
}) => {
  const [, actions] = useSelectedSpots()
  const added = actions.get(placeId)

  const handleClick = () => {
    onClick(placeId)
  }
  return (
    <Marker
      icon={
        selected
          ? undefined
          : {
              // default anchor(0,0) is position
              // Set (width * scale / 2, height * scale / 2) to move center of icon to position.
              anchor: new google.maps.Point(10, 10),
              path: 'M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10Z',
              fillColor: added ? 'blue' : '#D95140',
              fillOpacity: 1,
              scale: 1,
              strokeColor: '#FFF',
              strokeWeight: 1,
            }
      }
      position={{ lat, lng }}
      onClick={handleClick}></Marker>
  )
}

export default PlaceMarker
