import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Marker } from '@react-google-maps/api'
import { useClickAway } from 'react-use'

import CategorySelector from './CategorySelector'
import SearchBox from './SearchBox'
import SpotsByCategory from './SpotsByCategory'
import SpotCard, { SpotDTO } from './SpotCard'
import AnySpotCard from './AnySpotCard'

type Props = {
  anySpot?: google.maps.LatLngLiteral | null
  setAnySpot: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral | null>
  >
}
const MapOverlay: React.FC<Props> = ({ anySpot, setAnySpot }) => {
  const spotCardRef = React.useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(
    null
  )
  const [focusedSpot, setFocusedSpot] = React.useState<SpotDTO | null>(null)

  React.useEffect(() => {
    if (anySpot && !focusedSpot) {
      setFocusedSpot({ ...anySpot, name: '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anySpot])

  useClickAway(spotCardRef, () => {
    setFocusedSpot(null)
  })

  const handleMarkerClicked = (spot: SpotDTO) => {
    setFocusedSpot(spot)
    setAnySpot({ lat: spot.lat, lng: spot.lng })
  }

  return (
    <>
      <SpotsByCategory
        categoryId={selectedCategory}
        focusedSpot={focusedSpot}
        onClick={handleMarkerClicked}
      />
      <Box sx={{ position: 'absolute', left: 0, top: 0, ml: 2, mt: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SearchBox />
          <CategorySelector onChange={setSelectedCategory} />
        </Stack>
      </Box>
      {focusedSpot && (
        <>
          {anySpot && !focusedSpot.placeId && <Marker position={anySpot} />}
          <Box
            ref={spotCardRef}
            sx={{
              zIndex: 10,
              position: 'absolute',
              bottom: 25,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '400px',
              maxHeight: '150px',
            }}>
            {focusedSpot.placeId ? (
              <SpotCard spot={{ ...focusedSpot, id: focusedSpot.placeId }} />
            ) : (
              <AnySpotCard lat={focusedSpot.lat} lng={focusedSpot.lng} />
            )}
          </Box>
        </>
      )}
    </>
  )
}

export default MapOverlay
