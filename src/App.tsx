import React from 'react'

import RoutePlanner from 'components/RoutePlanner'
import { SelectedPrefectureProvider } from 'contexts/SelectedPrefectureProvider'
import { ApolloClientProvider } from 'contexts/ApolloClientProvider'
import { SelectedPlacesProvider } from 'contexts/SelectedPlacesProvider'
import { DirectionServiceProvider } from 'contexts/DirectionServiceProvider'
import { DistanceMatrixProvider } from 'contexts/DistanceMatrixProvider'
import { PlacesServiceProvider } from 'contexts/PlacesServiceProvider'
import { ConfirmationProvider } from 'contexts/ConfirmationProvider'
import { MapPropsProvider } from 'contexts/MapPropsProvider'

function App() {
  return (
    <ApolloClientProvider>
      <ConfirmationProvider>
        <DirectionServiceProvider>
          <DistanceMatrixProvider>
            <MapPropsProvider>
              <PlacesServiceProvider>
                <SelectedPrefectureProvider>
                  <SelectedPlacesProvider>
                    <RoutePlanner />
                  </SelectedPlacesProvider>
                </SelectedPrefectureProvider>
              </PlacesServiceProvider>
            </MapPropsProvider>
          </DistanceMatrixProvider>
        </DirectionServiceProvider>
      </ConfirmationProvider>
    </ApolloClientProvider>
  )
}

export default App
