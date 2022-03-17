import React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider, EmotionCache } from '@emotion/react'

import theme from 'configs/theme'
import createEmotionCache from 'configs/createEmotionCache'

import { CurrentPlanContextProvider } from 'contexts/CurrentPlanProvider'
import { ApolloClientProvider } from 'contexts/ApolloClientProvider'
import { DirectionServiceProvider } from 'contexts/DirectionServiceProvider'
import { DistanceMatrixProvider } from 'contexts/DistanceMatrixProvider'
import { PlacesServiceProvider } from 'contexts/PlacesServiceProvider'
import { ConfirmationProvider } from 'contexts/ConfirmationProvider'
import { MapPropsProvider } from 'contexts/MapPropsProvider'
import { SelectedSpotsProvider } from 'contexts/SelectedSpotsProvider'

const clientSideEmotionCache = createEmotionCache()
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const App: React.FC<MyAppProps> = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) => {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ApolloClientProvider>
        <ConfirmationProvider>
          <DirectionServiceProvider>
            <DistanceMatrixProvider>
              <MapPropsProvider>
                <PlacesServiceProvider>
                  <CurrentPlanContextProvider>
                    <SelectedSpotsProvider>
                      <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Component {...pageProps} />
                      </ThemeProvider>
                    </SelectedSpotsProvider>
                  </CurrentPlanContextProvider>
                </PlacesServiceProvider>
              </MapPropsProvider>
            </DistanceMatrixProvider>
          </DirectionServiceProvider>
        </ConfirmationProvider>
      </ApolloClientProvider>
    </CacheProvider>
  )
}

export default App
