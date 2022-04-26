import * as React from 'react'
import Box from '@mui/material/Box'

import GoogleMap from './GoogleMap'
import MapOverlay from './MapOverlay'

const SpotsMap = () => {
  const [anySpot, setAnyPlace] =
    React.useState<google.maps.LatLngLiteral | null>(null)

  const handleClick = (e?: google.maps.MapMouseEvent) => {
    e?.domEvent.preventDefault()
    if (anySpot) {
      setAnyPlace(null)
    } else {
      setAnyPlace(e?.latLng?.toJSON() || null)
    }
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <GoogleMap onClick={handleClick}>
        <MapOverlay anySpot={anySpot} setAnyPlace={setAnyPlace} />
      </GoogleMap>
    </Box>
  )
}

export default SpotsMap
