import * as React from 'react'
import Box from '@mui/material/Box'

import GoogleMap from './GoogleMap'
import { useMapLayer } from 'contexts/MapLayerModeProvider'

const SpotsMap = () => {
  const [anySpot, setAnySpot] =
    React.useState<google.maps.LatLngLiteral | null>(null)
  const [layer] = useMapLayer()

  const handleClick = (e?: google.maps.MapMouseEvent) => {
    e?.domEvent.preventDefault()
    if (anySpot) {
      setAnySpot(null)
    } else {
      setAnySpot(e?.latLng?.toJSON() || null)
    }
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <GoogleMap onClick={handleClick}>
        {React.createElement(layer, { anySpot, setAnySpot })}
      </GoogleMap>
    </Box>
  )
}

export default SpotsMap
