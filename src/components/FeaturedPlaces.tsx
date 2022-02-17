import * as React from 'react'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import GoogleMap from './organisms/GoogleMap'
import PlaceMarker from './organisms/PlaceMarker'
import { SelectedPrefectureContext } from 'contexts/SelectedPrefectureProvider'
import {
  SelectedPlacesContext,
  useSelectedPlacesActions,
} from 'contexts/SelectedPlacesProvider'
import {
  GetPrefectureQuery,
  GetSpotsByCategoryQuery,
  useGetPrefectureLazyQuery,
  useGetSpotsByCategoryLazyQuery,
} from 'generated/graphql'
import { StepperHandlerContext } from './RoutePlanner'
import CategorySelector from './organisms/CategorySelector'
import SpotCard from './organisms/SpotCard'
import SpotsCandidates from './organisms/SpotsCandidates'

const FeaturedPlaces = () => {
  const [getPrefecture, { loading, data, error }] = useGetPrefectureLazyQuery()
  const [target, setTarget] = React.useState<
    Required<GetPrefectureQuery>['prefectures_by_pk'] | null
  >(null)

  const [getSpots] = useGetSpotsByCategoryLazyQuery()
  const [spots, setSpots] = React.useState<GetSpotsByCategoryQuery['spots']>([])

  const selected = React.useContext(SelectedPrefectureContext)
  const [focusedSpot, setFocusedSpot] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const places = React.useContext(SelectedPlacesContext)
  const handleNext = React.useContext(StepperHandlerContext)
  const actions = useSelectedPlacesActions()

  React.useEffect(() => {
    if (selected) {
      getPrefecture({ variables: { code: selected } })
    }
  }, [getPrefecture, selected])

  React.useEffect(() => {
    if (data?.prefectures_by_pk) {
      setTarget(data.prefectures_by_pk || null)
    }
  }, [data])

  const handleSelectCategory = React.useCallback(
    async (id: number) => {
      const typesResults = await getSpots({
        variables: { categoryId: id },
      })
      if (typesResults.error) {
        console.error(`Fail to fetch types by category id ${id}`)
      }
      console.log(typesResults)
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

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (error) {
    console.error(error)
  }

  if (loading) {
    return <>...now loading</>
  }

  return (
    <>
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
          <CategorySelector onChange={handleSelectCategory} />
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
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, pb: 2, pl: 1 }}>
          <Badge badgeContent={places.length} color="primary">
            <Button variant="contained" onClick={handleOpen}>
              Spots List
            </Button>
          </Badge>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, right: 0, pb: 2, pr: 1 }}>
          <Button
            variant="contained"
            disabled={places.length < 2}
            onClick={handleNext}>
            Get Route
          </Button>{' '}
        </Box>
      </Box>
      <SpotsCandidates open={open} places={places} onClose={handleClose} />
    </>
  )
}

export default FeaturedPlaces
