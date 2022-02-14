import * as React from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import GoogleMap from './organisms/GoogleMap'
import PlaceMarker from './organisms/PlaceMarker'
import { SelectedPrefectureContext } from 'contexts/SelectedPrefectureProvider'
import { SelectedPlacesContext } from 'contexts/SelectedPlacesProvider'
import {
  GetPrefectureQuery,
  GetSpotsByCategoryQuery,
  useGetPrefectureLazyQuery,
  useGetSpotsByCategoryLazyQuery,
} from 'generated/graphql'
import { StepperHandlerContext } from './RoutePlanner'
import CategorySelector from './CategorySelector'
import SpotCard from './organisms/SpotCard'

const FeaturedPlaces = () => {
  const [getPrefecture, { loading, data, error }] = useGetPrefectureLazyQuery()
  const [target, setTarget] = React.useState<
    Required<GetPrefectureQuery>['prefectures_by_pk'] | null
  >(null)

  const [getSpots] = useGetSpotsByCategoryLazyQuery()
  const [spots, setSpots] = React.useState<GetSpotsByCategoryQuery['spots']>([])

  const selected = React.useContext(SelectedPrefectureContext)
  const places = React.useContext(SelectedPlacesContext)
  const handleNext = React.useContext(StepperHandlerContext)

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

  const handleSelectCategory = async (id: string) => {
    const typesResults = await getSpots({
      variables: { categoryId: Number.parseInt(id) },
    })
    if (typesResults.error) {
      console.error(`Fail to fetch types by category id ${id}`)
    }
    console.log(typesResults)
    setSpots(typesResults.data?.spots || [])
  }

  if (error) {
    console.error(error)
  }

  if (loading) {
    return <>...now loading</>
  }

  return (
    <Stack alignItems="center">
      <CategorySelector onChange={handleSelectCategory} />
      <GoogleMap
        center={target ? { lat: target.lat, lng: target.lng } : undefined}
        zoom={target?.zoom}>
        <>
          {target &&
            spots.map(item => (
              <PlaceMarker
                key={item.place_id}
                name={item.name}
                placeId={item.place_id}
                lat={item.lat}
                lng={item.lng}
              />
            ))}
        </>
      </GoogleMap>
      <Typography>Selected Spots:</Typography>
      <Stack spacing={2}>
        {places.map(place => (
          <SpotCard key={place.placeId} placeId={place.placeId} />
        ))}
      </Stack>
      <Stack alignItems="end">
        <Button disabled={places.length < 2} onClick={handleNext}>
          Get Route
        </Button>
      </Stack>
    </Stack>
  )
}

export default FeaturedPlaces
