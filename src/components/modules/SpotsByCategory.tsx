import * as React from 'react'

import {
  GetSpotsByCategoryQuery,
  useGetSpotsByCategoryLazyQuery,
} from 'generated/graphql'

import PlaceMarker from './PlaceMarker'
import { useMapProps } from 'hooks/googlemaps/useMapProps'
import { useWaypoints } from 'hooks/useWaypoints'

type Props = {
  categoryId: number | null
  focusedSpot: string
  onClick: (placeId: string) => void
}
const SpotsByCategory: React.FC<Props> = ({
  categoryId,
  focusedSpot,
  onClick,
}) => {
  const [spots, setSpots] = React.useState<GetSpotsByCategoryQuery['spots']>([])
  const [getSpots] = useGetSpotsByCategoryLazyQuery()
  const [mapProps] = useMapProps()
  const [waypoints] = useWaypoints()

  React.useEffect(() => {
    const bounds = mapProps.bounds
    const northEast = bounds?.ne
    const southWest = bounds?.sw
    if (northEast && southWest && categoryId) {
      getSpots({
        variables: {
          categoryId,
          north: northEast.lat(),
          east: northEast.lng(),
          south: southWest.lat(),
          west: southWest.lng(),
        },
      })
        .then((results) => {
          if (results.error) {
            console.error(`Fail to fetch types by category id ${categoryId}`)
          }
          setSpots(results.data?.spots || [])
        })
        .catch((error) => {
          console.error(error)
        })
    }
    // マップが移動するたびに何度も Fetch することを防ぐため、bounds は依存に含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, getSpots])

  return (
    <>
      {spots.map((item) => (
        <PlaceMarker
          key={item.place_id}
          placeId={item.place_id}
          selected={!waypoints?.find((spot) => spot.placeId === item.place_id)}
          focused={item.place_id === focusedSpot}
          lat={item.lat}
          lng={item.lng}
          onClick={onClick}
        />
      ))}
    </>
  )
}

export default SpotsByCategory
