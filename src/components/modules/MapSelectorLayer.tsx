import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Marker, useGoogleMap } from '@react-google-maps/api'

const MapSelectorLayer = () => {
  const map = useGoogleMap()
  const [center, setCenter] = React.useState<google.maps.LatLng | null>(null)

  React.useEffect(() => {
    setCenter(map?.getCenter() || null)
    const listener = map?.addListener('center_changed', () => {
      setCenter(map.getCenter() || null)
    })
    return () => {
      listener?.remove()
    }
  }, [map])
  return (
    <>
      <Box
        position="absolute"
        top={0}
        width="100%"
        py={2}
        sx={{ background: 'white' }}>
        <Stack direction="row" alignItems="center">
          <Button>X</Button>
          <Typography variant="h5">ホテルの位置を選択</Typography>
          <Box flexGrow={1} />
          <Button>OK</Button>
        </Stack>
      </Box>
      {center && <Marker position={center} />}
    </>
  )
}

export default MapSelectorLayer
