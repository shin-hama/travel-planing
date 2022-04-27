import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Marker, useGoogleMap } from '@react-google-maps/api'
import { useMapLayer } from 'contexts/MapLayerModeProvider'
import { useTravelPlan } from 'hooks/useTravelPlan'

const MapSelectorLayer = () => {
  const map = useGoogleMap()
  const [center, setCenter] = React.useState<google.maps.LatLng | null>(null)
  const [, setMode] = useMapLayer()
  const [, planApi] = useTravelPlan()

  React.useEffect(() => {
    setCenter(map?.getCenter() || null)
    const listener = map?.addListener('center_changed', () => {
      setCenter(map.getCenter() || null)
    })
    return () => {
      listener?.remove()
    }
  }, [map])

  const handleCancel = () => {
    setMode('normal')
  }

  const handleOk = () => {
    setMode('normal')
    if (center) {
      planApi.update({
        lodging: {
          name: 'Hotel',
          lat: center.lat(),
          lng: center.lng(),
          placeId: null,
          imageUrl: '',
          duration: 60,
          durationUnit: 'minute',
        },
      })
    } else {
      alert('Fail to set hotel')
    }
  }

  return (
    <>
      <Box
        position="absolute"
        top={0}
        width="100%"
        py={2}
        sx={{ background: 'white' }}>
        <Stack direction="row" alignItems="center">
          <Button onClick={handleCancel}>X</Button>
          <Typography variant="h5">ホテルの位置を選択</Typography>
          <Box flexGrow={1} />
          <Button onClick={handleOk}>OK</Button>
        </Stack>
      </Box>
      {center && <Marker position={center} />}
    </>
  )
}

export default MapSelectorLayer
