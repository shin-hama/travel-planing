import React from 'react'
import { Map } from 'components/atoms'

import { SelectedPrefectureProvider } from 'contexts/SelectedPrefectureProvider'
import { ApolloClientProvider } from 'contexts/ApolloClientProvider'
import FeaturedPlaces from 'components/FeaturedPlaces'
import { SelectedPlacesProvider } from 'contexts/SelectedPlacesProvider'

import Stack from '@mui/material/Stack'
import RouteViewer from 'components/atoms/RouteViewer'

function App() {
  return (
    <ApolloClientProvider>
      <SelectedPrefectureProvider>
        <SelectedPlacesProvider>
          <Stack direction="row">
            <FeaturedPlaces />
            <RouteViewer />
          </Stack>
          <Map />
        </SelectedPlacesProvider>
      </SelectedPrefectureProvider>
    </ApolloClientProvider>
  )
}

export default App
