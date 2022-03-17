import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { useClickAway } from 'react-use'

import CategorySelector from './CategorySelector'
import GoogleMap from './GoogleMap'
import SearchBox from './SearchBox'
import SpotCard from './SpotCard'
import SpotsByCategory from './SpotsByCategory'

const SpotsMap = () => {
  const spotCardRef = React.useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(
    null
  )
  useClickAway(spotCardRef, () => {
    setFocusedSpot('')
  })

  const [focusedSpot, setFocusedSpot] = React.useState('')

  const handleMarkerClicked = (placeId: string) => {
    setFocusedSpot(placeId)
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <GoogleMap>
        <SpotsByCategory
          categoryId={selectedCategory}
          focusedSpot={focusedSpot}
          onClick={handleMarkerClicked}
        />
      </GoogleMap>
      <Box sx={{ position: 'absolute', left: 0, top: 0, ml: 2, mt: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SearchBox />
          <CategorySelector onChange={setSelectedCategory} />
        </Stack>
      </Box>
      {focusedSpot && (
        <Box
          ref={spotCardRef}
          sx={{
            zIndex: 10,
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            pb: 2,
            width: '90%',
            maxWidth: '400px',
            maxHeight: '150px',
          }}>
          <SpotCard placeId={focusedSpot} />
        </Box>
      )}
    </Box>
  )
}

export default SpotsMap
