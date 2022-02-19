import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import CategorySelector from './CategorySelector'
import GoogleMap from './GoogleMap'
import PlaceMarker from './PlaceMarker'
import SpotCard from './SpotCard'
import SearchBox from './SearchBox'
import { useSelectedPlacesActions } from 'contexts/SelectedPlacesProvider'
import { SelectedPrefectureContext } from 'contexts/SelectedPrefectureProvider'
import {
  GetPrefectureQuery,
  GetSpotsByCategoryQuery,
  useGetPrefectureLazyQuery,
  useGetSpotsByCategoryLazyQuery,
} from 'generated/graphql'

const SpotsMap = () => {
  const [target, setTarget] = React.useState<
    Required<GetPrefectureQuery>['prefectures_by_pk'] | null
  >(null)
  const [spots, setSpots] = React.useState<GetSpotsByCategoryQuery['spots']>([])
  const [getSpots] = useGetSpotsByCategoryLazyQuery()
  const [getPrefecture, { loading, data, error }] = useGetPrefectureLazyQuery()
  const selected = React.useContext(SelectedPrefectureContext)

  const [focusedSpot, setFocusedSpot] = React.useState('')
  const actions = useSelectedPlacesActions()

  React.useEffect(() => {
    if (data?.prefectures_by_pk) {
      setTarget(data.prefectures_by_pk || null)
    }
  }, [data])

  React.useEffect(() => {
    if (selected) {
      getPrefecture({ variables: { code: selected } })
    }
  }, [getPrefecture, selected])

  const handleSelectCategory = React.useCallback(
    async (id: number) => {
      const typesResults = await getSpots({
        variables: { categoryId: id },
      })
      if (typesResults.error) {
        console.error(`Fail to fetch types by category id ${id}`)
      }
      setSpots(typesResults.data?.spots || [])
    },
    [getSpots]
  )

  const handleMarkerClicked = (placeId: string) => {
    setFocusedSpot(placeId)
  }

  const handleClickAdd = () => {
    if (focusedSpot) {
      actions.push({ placeId: focusedSpot })
      setFocusedSpot('')
    }
  }

  if (error) {
    console.error(error)
  }

  if (loading) {
    return <>...now loading</>
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <GoogleMap
        center={target ? { lat: target.lat, lng: target.lng } : undefined}
        zoom={target?.zoom}>
        <>
          {target &&
            spots.map(item => (
              <PlaceMarker
                key={item.place_id}
                placeId={item.place_id}
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
      <Box
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
        {focusedSpot && (
          <SpotCard
            placeId={focusedSpot}
            actionNode={
              <Button
                variant="contained"
                size="small"
                onClick={handleClickAdd}
                sx={{ marginLeft: 'auto' }}>
                Add
              </Button>
            }
          />
        )}
      </Box>
    </Box>
  )
}

export default SpotsMap
