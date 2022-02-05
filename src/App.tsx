import React from 'react'
import {
  GoogleMap,
  LoadScript,
  useGoogleMap,
  InfoBox,
} from '@react-google-maps/api'
import { Map } from 'components/atoms'

import './App.css'
import {
  SelectedPrefectureContext,
  SelectedPrefectureProvider,
} from 'contexts/SelectedPrefectureProvider'

const containerStyle = {
  width: '400px',
  height: '400px',
}

const center = { lat: 43.5941035450526, lng: 142.70038569359122 }

const Test = () => {
  const [json, setJson] = React.useState({})
  const [currentCenter, setCurrentCenter] = React.useState(center)
  const selected = React.useContext(SelectedPrefectureContext)

  const map = useGoogleMap()

  React.useEffect(() => {
    if (map !== null && selected !== null) {
      map.setCenter({ lat: selected.lat, lng: selected.lng })
      map.setZoom(selected.zoom)
    }
  }, [map, selected])

  React.useEffect(() => {
    if (map) {
      map.addListener('center_changed', () =>
        setCurrentCenter(map.getCenter()?.toJSON() || center)
      )
      map.addListener('zoom_changed', () =>
        setJson(prev => ({ ...prev, zoom: map.getZoom() }))
      )
      setJson(prev => ({ ...prev, zoom: map.getZoom() }))
    }
  }, [map])

  React.useEffect(() => {
    setJson(prev => ({ ...prev, ...currentCenter }))
  }, [currentCenter])

  return (
    <InfoBox
      position={currentCenter}
      options={{ closeBoxURL: '', enableEventPropagation: true }}>
      <div style={{ backgroundColor: 'yellow', opacity: 0.75, padding: 12 }}>
        <div style={{ fontSize: 10 }}>
          <pre>{JSON.stringify(json, null, 2)}</pre>
          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(json))}>
            copy
          </button>
        </div>
      </div>
    </InfoBox>
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
            zoom={6}>
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
