import React from 'react'

import RoutePlanner from 'components/pages/RoutePlanner'
import { CurrentPlanContextProvider } from 'contexts/CurrentPlanProvider'
import { ApolloClientProvider } from 'contexts/ApolloClientProvider'
import { SelectedPlacesProvider } from 'contexts/SelectedPlacesProvider'
import { DirectionServiceProvider } from 'contexts/DirectionServiceProvider'
import { DistanceMatrixProvider } from 'contexts/DistanceMatrixProvider'
import { PlacesServiceProvider } from 'contexts/PlacesServiceProvider'
import { ConfirmationProvider } from 'contexts/ConfirmationProvider'
import { MapPropsProvider } from 'contexts/MapPropsProvider'
import { SelectedSpotsProvider } from 'contexts/SelectedSpotsProvider'

function App() {
  return (
    <ApolloClientProvider>
      <ConfirmationProvider>
        <DirectionServiceProvider>
          <DistanceMatrixProvider>
            <MapPropsProvider>
              <PlacesServiceProvider>
                <CurrentPlanContextProvider>
                  <SelectedSpotsProvider>
                    <SelectedPlacesProvider>
                      <RoutePlanner />
                    </SelectedPlacesProvider>
                  </SelectedSpotsProvider>
                </CurrentPlanContextProvider>
              </PlacesServiceProvider>
            </MapPropsProvider>
          </DistanceMatrixProvider>
        </DirectionServiceProvider>
      </ConfirmationProvider>
    </ApolloClientProvider>
  )
}

export default App
