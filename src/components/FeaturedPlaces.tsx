import * as React from 'react'
import GoogleMap from './atoms/GoogleMap'
import PlaceMarker from './atoms/PlaceMarker'

import { SelectedPrefectureContext } from 'contexts/SelectedPrefectureProvider'
import {
  GetPrefectureQuery,
  useGetPrefectureLazyQuery,
} from 'generated/graphql'
import SearchBox from './atoms/SearchBox'

const FeaturedPlaces = () => {
  const [markers, setMarkers] = React.useState<
    Array<{
      name: string
      lat: number
      lng: number
    }>
  >([])
  const [getPrefecture, { data, error }] = useGetPrefectureLazyQuery()
  const [target, setTarget] = React.useState<
    GetPrefectureQuery['prefectures'][number] | null
  >(null)
  const selected = React.useContext(SelectedPrefectureContext)

  React.useEffect(() => {
    if (selected) {
      getPrefecture({ variables: { code: selected } })
    }
  }, [getPrefecture, selected])

  React.useEffect(() => {
    if (data) {
      setTarget(data.prefectures[0])
    }
  }, [data])

  React.useEffect(() => {
    if (target !== null) {
      console.log(target)
      setMarkers(target.cities.map(item => item))
    }
  }, [target])

  if (error) {
    console.error(error)
  }

  return (
    <GoogleMap
      center={target ? { lat: target.lat, lng: target.lng } : undefined}
      zoom={target?.zoom}>
      <>
        <SearchBox />
        {markers.map(item => (
          <PlaceMarker key={item.name} lat={item.lat} lng={item.lng} />
        ))}
      </>
    </GoogleMap>
  )
}

export default FeaturedPlaces
