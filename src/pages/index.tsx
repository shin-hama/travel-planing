import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'

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
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

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
                      <PlaningMain />
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
