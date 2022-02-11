import * as React from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import GoogleMap from './atoms/GoogleMap'
import PlaceMarker from './atoms/PlaceMarker'
import { SelectedPrefectureContext } from 'contexts/SelectedPrefectureProvider'
import { SelectedPlacesContext } from 'contexts/SelectedPlacesProvider'
import {
  GetPrefectureQuery,
  useGetPrefectureLazyQuery,
} from 'generated/graphql'
import { StepperHandlerContext } from './RoutePlanner'

const FeaturedPlaces = () => {
  const [getPrefecture, { loading, data, error }] = useGetPrefectureLazyQuery()
  const [target, setTarget] = React.useState<
    Required<GetPrefectureQuery>['prefectures_by_pk'] | null
  >(null)

  const selected = React.useContext(SelectedPrefectureContext)
  const places = React.useContext(SelectedPlacesContext)
  const handleNext = React.useContext(StepperHandlerContext)

  React.useEffect(() => {
    if (selected) {
      getPrefecture({ variables: { code: selected } })
    }
  }, [getPrefecture, selected])

  React.useEffect(() => {
    if (data) {
      setTarget(data.prefectures_by_pk || null)
    }
  }, [data])

  if (error) {
    console.error(error)
  }

  if (loading) {
    return <>...now loading</>
  }

  return (
    <Stack alignItems="center">
      <GoogleMap
        center={target ? { lat: target.lat, lng: target.lng } : undefined}
        zoom={target?.zoom}>
        <>
          {target &&
            target.spots.map(item => (
              <PlaceMarker
                key={item.name}
                name={item.name}
                placeId={item.place_id}
                lat={item.lat}
                lng={item.lng}
              />
            ))}
        </>
      </GoogleMap>
      <Typography>Now Selected:</Typography>
      <Typography>{places.map(place => place.name).join(', ')}</Typography>
      <Stack alignItems="end">
        <Button disabled={places.length === 0} onClick={handleNext}>
          Get Route
        </Button>
      </Stack>
    </Stack>
  )
}

export default FeaturedPlaces
