import * as React from 'react'

import PlaceMarker from './PlaceMarker'
import { useWaypoints } from 'hooks/useWaypoints'
import type { SpotDTO } from '../SpotCard'

type Props = {
  spots: Array<SpotDTO>
  focusedSpot: SpotDTO | null
  onClick: (placeId: SpotDTO) => void
}
const SpotMarkers: React.FC<Props> = ({ spots, focusedSpot, onClick }) => {
  const [waypoints] = useWaypoints()

  return (
    <>
      {spots.map((item) => (
        <PlaceMarker
          key={item.placeId}
          name={item.name}
          placeId={item.placeId}
          selected={
            waypoints?.find((spot) => spot.placeId === item.placeId) !==
            undefined
          }
          focused={item.placeId === focusedSpot?.placeId}
          lat={item.lat}
          lng={item.lng}
          onClick={onClick}
        />
      ))}
    </>
  )
}

export default SpotMarkers
