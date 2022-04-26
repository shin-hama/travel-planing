import * as React from 'react'

import {
  GetSpotsByCategoryQuery,
  useGetSpotsByCategoryLazyQuery,
} from 'generated/graphql'

import PlaceMarker from './PlaceMarker'
import { useMapProps } from 'hooks/googlemaps/useMapProps'
import { useWaypoints } from 'hooks/useWaypoints'
import type { SpotDTO } from './SpotCard'

type Props = {
  categoryId: number | null
  focusedSpot: SpotDTO | null
  onClick: (placeId: SpotDTO) => void
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
    if (!mapProps.mounted) {
      return
    }

    const bounds = mapProps.bounds
    if (bounds && categoryId) {
      getSpots({
        variables: {
          categoryId,
          ...bounds.toJSON(),
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
  }, [categoryId, getSpots, mapProps.mounted])

  return (
    <>
      {spots.map((item) => (
        <PlaceMarker
          key={item.place_id}
          name={item.name}
          placeId={item.place_id}
          selected={
            waypoints?.find((spot) => spot.placeId === item.place_id) !==
            undefined
          }
          focused={item.place_id === focusedSpot?.placeId}
          lat={item.lat}
          lng={item.lng}
          onClick={onClick}
        />
      ))}
    </>
  )
}

export default SpotsByCategory
