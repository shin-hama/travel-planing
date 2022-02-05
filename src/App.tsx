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
import { useGeocoding } from 'hooks/useGeocoding'

const containerStyle = {
  width: '400px',
  height: '400px',
}

const center = { lat: 36.5941035450526, lng: 138.70038569359122 }

const Test = () => {
  const selected = React.useContext(SelectedPrefectureContext)
  const [markers, setMarkers] = React.useState<google.maps.GeocoderResult[]>([])

  const geo = useGeocoding()

  const map = useGoogleMap()

  React.useEffect(() => {
    console.log('mount')
    return () => {
      console.log('test')
    }
  }, [])

  React.useEffect(() => {
    if (map !== null && selected !== null) {
      map.setCenter({ lat: selected.lat, lng: selected.lng })
      map.setZoom(selected.zoom)
    }
  }, [map, selected])

  React.useEffect(() => {
    if (selected) {
      const func = async () => {
        const cities = await Promise.all(
          selected.cities.map(async city => {
            const result = await geo.search(city)
            console.log(result)
            return result
          })
        )
        setMarkers(cities)
      }
      func()
    }
  }, [geo, selected])

  return (
    <>
      {markers.map(item => (
        <Marker key={item.place_id} position={item.geometry.location}></Marker>
      ))}
    </>
  )
}

function App() {
  return (
    <>
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
    </>
  )
}

export default App
