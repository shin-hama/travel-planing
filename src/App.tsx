import React from 'react'

import RoutePlanner from 'components/RoutePlanner'
import { SelectedPrefectureProvider } from 'contexts/SelectedPrefectureProvider'
import { ApolloClientProvider } from 'contexts/ApolloClientProvider'
import { SelectedPlacesProvider } from 'contexts/SelectedPlacesProvider'
import { DirectionServiceProvider } from 'contexts/DirectionServiceProvider'
import { DistanceMatrixProvider } from 'contexts/DistanceMatrixProvider'
import { PlacesServiceProvider } from 'contexts/PlacesServiceProvider'

function App() {
  return (
    <ApolloClientProvider>
      <DirectionServiceProvider>
        <DistanceMatrixProvider>
          <PlacesServiceProvider>
            <SelectedPrefectureProvider>
              <SelectedPlacesProvider>
                <RoutePlanner />
              </SelectedPlacesProvider>
            </SelectedPrefectureProvider>
          </PlacesServiceProvider>
        </DistanceMatrixProvider>
      </DirectionServiceProvider>
    </ApolloClientProvider>
  )
}

export default App
