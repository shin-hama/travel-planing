import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import CategorySelector from './CategorySelector'
import GoogleMap, { Bounds } from './GoogleMap'
import PlaceMarker from './PlaceMarker'
import SearchBox from './SearchBox'
import { SelectedPrefectureContext } from 'contexts/SelectedPrefectureProvider'
import {
  GetSpotsByCategoryQuery,
  useGetSpotsByCategoryLazyQuery,
} from 'generated/graphql'
import SpotsList from './SpotsList'
import { useClickAway } from 'react-use'

const SpotsMap = () => {
  const [spots, setSpots] = React.useState<GetSpotsByCategoryQuery['spots']>([])
  const [getSpots] = useGetSpotsByCategoryLazyQuery()
  const { destination } = React.useContext(SelectedPrefectureContext)
  const [mapBounds, setMapBounds] = React.useState<Bounds>({})

  const spotCardRef = React.useRef<HTMLDivElement>(null)
  useClickAway(spotCardRef, (e) => {
    setFocusedSpot('')
  })

  const [focusedSpot, setFocusedSpot] = React.useState('')

  const handleSelectCategory = React.useCallback(
    async (id: number) => {
      console.log(mapBounds)
      if (mapBounds.ne && mapBounds.sw) {
        const results = await getSpots({
          variables: {
            categoryId: id,
            north: mapBounds.ne.lat(),
            south: mapBounds.sw.lat(),
            west: mapBounds.sw.lng(),
            east: mapBounds.ne.lng(),
          },
        })
        console.log(results)
        if (results.error) {
          console.error(`Fail to fetch types by category id ${id}`)
        }
        console.log(results.data)
        setSpots(results.data?.spots || [])
      }
    },
    [getSpots, mapBounds]
  )

  const handleMarkerClicked = (placeId: string) => {
    setFocusedSpot(placeId)
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <GoogleMap
        center={
          destination
            ? { lat: destination.lat, lng: destination.lng }
            : undefined
        }
        zoom={destination?.zoom}
        setMapBounds={setMapBounds}>
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
