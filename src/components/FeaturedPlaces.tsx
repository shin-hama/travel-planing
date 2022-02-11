import * as React from 'react'
import GoogleMap from './atoms/GoogleMap'
import PlaceMarker from './atoms/PlaceMarker'

import { SelectedPrefectureContext } from 'contexts/SelectedPrefectureProvider'
import {
  GetPrefectureQuery,
  useGetPrefectureLazyQuery,
} from 'generated/graphql'

const FeaturedPlaces = () => {
  const [getPrefecture, { data, error }] = useGetPrefectureLazyQuery()
  const [target, setTarget] = React.useState<
    Required<GetPrefectureQuery>['prefectures_by_pk'] | null
  >(null)

  const selected = React.useContext(SelectedPrefectureContext)

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

  return (
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
  )
}

export default FeaturedPlaces
