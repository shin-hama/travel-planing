import React from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker,
  useGoogleMap,
} from '@react-google-maps/api'
import { Map } from 'components/atoms'

import './App.css'
import {
  SelectedPrefectureContext,
  SelectedPrefectureProvider,
} from 'contexts/SelectedPrefectureProvider'
import { ApolloClientProvider } from 'contexts/ApolloClientProvider'
import {
  GetPrefectureQuery,
  useGetPrefectureLazyQuery,
} from 'generated/graphql'

const containerStyle = {
  width: '400px',
  height: '400px',
}

const center = { lat: 36.5941035450526, lng: 138.70038569359122 }

const Test = () => {
  const selected = React.useContext(SelectedPrefectureContext)
  const [markers, setMarkers] = React.useState<
    Array<{
      name: string
      lat: number
      lng: number
    }>
  >([])
  const [getPrefecture, { data, error }] = useGetPrefectureLazyQuery()
  const [target, setTarget] = React.useState<GetPrefectureQuery | null>(null)

  const map = useGoogleMap()

  React.useEffect(() => {
    if (map !== null && target !== null) {
      if (target.prefectures.length !== 1) {
        return
      }
      const test = target.prefectures[0]
      map.setCenter({
        lat: test.lat || 0,
        lng: test.lng || 0,
      })
      map.setZoom(test.zoom || 8)

      setMarkers(
        test.cities.map(item => ({
          name: item.name || '',
          lng: item.lng || 0,
          lat: item.lng || 0,
        }))
      )
    }
  }, [map, target])

  React.useEffect(() => {
    console.log('test')
    if (selected) {
      console.log(selected)
      getPrefecture({ variables: { code: selected } })
    }
  }, [getPrefecture, selected])

  React.useEffect(() => {
    if (data) {
      console.log('test')
      console.log(data)
      setTarget(data)
    }
  }, [data])

  if (error) {
    console.error(error)
  }

  return (
    <>
      {markers.map(item => (
        <Marker
          key={item.name}
          position={{ lat: item.lat, lng: item.lng }}></Marker>
      ))}
    </>
  )
}

function App() {
  return (
    <>
      <ApolloClientProvider>
        <SelectedPrefectureProvider>
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY || ''}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={4}>
              {/* Child components, such as markers, info windows, etc. */}
              <Test></Test>
            </GoogleMap>
          </LoadScript>
          <Map />
        </SelectedPrefectureProvider>
      </ApolloClientProvider>
    </>
  )
}

export default App
