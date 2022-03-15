import React from 'react'

import { CurrentPlanContextProvider } from 'contexts/CurrentPlanProvider'
import { ApolloClientProvider } from 'contexts/ApolloClientProvider'
import { DirectionServiceProvider } from 'contexts/DirectionServiceProvider'
import { DistanceMatrixProvider } from 'contexts/DistanceMatrixProvider'
import { PlacesServiceProvider } from 'contexts/PlacesServiceProvider'
import { ConfirmationProvider } from 'contexts/ConfirmationProvider'
import { MapPropsProvider } from 'contexts/MapPropsProvider'
import { SelectedSpotsProvider } from 'contexts/SelectedSpotsProvider'
import PlaningMain from 'components/pages/PlaningMain'

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
                    <PlaningMain />
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
