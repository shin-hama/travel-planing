import React from 'react'
import { AppProps } from 'next/app'
import CssBaseline from '@mui/material/CssBaseline'

import { CurrentPlanContextProvider } from 'contexts/CurrentPlanProvider'
import { ApolloClientProvider } from 'contexts/ApolloClientProvider'
import { DirectionServiceProvider } from 'contexts/DirectionServiceProvider'
import { DistanceMatrixProvider } from 'contexts/DistanceMatrixProvider'
import { PlacesServiceProvider } from 'contexts/PlacesServiceProvider'
import { ConfirmationProvider } from 'contexts/ConfirmationProvider'
import { MapPropsProvider } from 'contexts/MapPropsProvider'
import { SelectedSpotsProvider } from 'contexts/SelectedSpotsProvider'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <CssBaseline />
      <ApolloClientProvider>
        <ConfirmationProvider>
          <DirectionServiceProvider>
            <DistanceMatrixProvider>
              <MapPropsProvider>
                <PlacesServiceProvider>
                  <CurrentPlanContextProvider>
                    <SelectedSpotsProvider>
                      <Component {...pageProps} />
                    </SelectedSpotsProvider>
                  </CurrentPlanContextProvider>
                </PlacesServiceProvider>
              </MapPropsProvider>
            </DistanceMatrixProvider>
          </DirectionServiceProvider>
        </ConfirmationProvider>
      </ApolloClientProvider>
    </>
  )
}

export default App
