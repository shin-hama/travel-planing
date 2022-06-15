import * as React from 'react'

import PlaceMarker from './PlaceMarker'
import { useWaypoints } from 'hooks/useWaypoints'
import { SpotDTO } from 'hooks/useSchedules'

type Props = {
  spots: Array<SpotDTO>
  focusedSpot: SpotDTO | null
  routeMode?: boolean
  onClick: (place: SpotDTO) => void
}
const SpotMarkers: React.FC<Props> = ({
  spots,
  focusedSpot,
  routeMode,
  onClick,
}) => {
  const [waypoints] = useWaypoints()

  const handleClick = (spot: SpotDTO) => () => {
    onClick(spot)
  }

  return (
    <>
      {spots.map((item, i) => (
        <PlaceMarker
          key={item.placeId}
          selected={
            waypoints?.find((spot) => spot.placeId === item.placeId) !==
            undefined
          }
          focused={item.placeId === focusedSpot?.placeId}
          label={
            routeMode
              ? {
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  text: (i + 1).toString(),
                }
              : undefined
          }
          position={{ lat: item.lat, lng: item.lng }}
          onClick={handleClick(item)}
        />
      ))}
    </>
  )
}

export default SpotMarkers
