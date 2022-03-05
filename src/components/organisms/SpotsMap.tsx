import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { useClickAway } from 'react-use'

import CategorySelector from './CategorySelector'
import GoogleMap from './GoogleMap'
import PlaceMarker from './PlaceMarker'
import SearchBox from './SearchBox'
import {
  GetSpotsByCategoryQuery,
  useGetSpotsByCategoryLazyQuery,
} from 'generated/graphql'
import SpotsList from './SpotsList'
import { useMapProps } from 'hooks/useMapProps'

const SpotsMap = () => {
  const [spots, setSpots] = React.useState<GetSpotsByCategoryQuery['spots']>([])
  const [getSpots] = useGetSpotsByCategoryLazyQuery()
  const [mapProps] = useMapProps()

  const spotCardRef = React.useRef<HTMLDivElement>(null)
  useClickAway(spotCardRef, (e) => {
    setFocusedSpot('')
  })

  const [focusedSpot, setFocusedSpot] = React.useState('')

  const handleSelectCategory = React.useCallback(
    async (id: number) => {
      const mapBounds = mapProps.bounds
      if (mapBounds?.ne && mapBounds?.sw) {
        const results = await getSpots({
          variables: {
            categoryId: id,
            north: mapBounds.ne.lat(),
            south: mapBounds.sw.lat(),
            west: mapBounds.sw.lng(),
            east: mapBounds.ne.lng(),
          },
        })
        if (results.error) {
          console.error(`Fail to fetch types by category id ${id}`)
        }
        setSpots(results.data?.spots || [])
      }
    },
    [getSpots, mapProps.bounds]
  )

  const handleMarkerClicked = (placeId: string) => {
    setFocusedSpot(placeId)
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <GoogleMap>
        <>
          {spots.map((item) => (
            <PlaceMarker
              key={item.place_id}
              placeId={item.place_id}
              selected={item.place_id === focusedSpot}
              lat={item.lat}
              lng={item.lng}
              onClick={handleMarkerClicked}
            />
          ))}
        </>
      </GoogleMap>
      <Box sx={{ position: 'absolute', left: 0, top: 0, ml: 2, mt: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SearchBox />
          <CategorySelector onChange={handleSelectCategory} />
        </Stack>
      </Box>
      {focusedSpot && (
        <Box
          ref={spotCardRef}
          sx={{
            zIndex: 10,
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            pb: 2,
            width: '90%',
            maxWidth: '400px',
            maxHeight: '150px',
          }}>
          <SpotsList spots={[focusedSpot]} />
        </Box>
      )}
    </Box>
  )
}

export default SpotsMap
