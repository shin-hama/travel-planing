import * as React from 'react'

import { useGetSpotsByCategoryLazyQuery } from 'generated/graphql'

import { useMapProps } from 'hooks/googlemaps/useMapProps'
import { SpotDTO } from './useSchedules'

export const useSpots = () => {
  const [spots, setSpots] = React.useState<Array<SpotDTO>>([])
  const [getSpots] = useGetSpotsByCategoryLazyQuery()
  const [mapProps] = useMapProps()

  const reload = React.useCallback(
    (categoryId: number) => {
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
            setSpots(
              results.data?.spots.map(
                (spot): SpotDTO => ({
                  ...spot,
                  placeId: spot.place_id,
                })
              ) || []
            )
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
    // マップが移動するたびに何度も Fetch することを防ぐため、bounds は依存に含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getSpots, mapProps.mounted]
  )

  return [spots, reload] as const
}
