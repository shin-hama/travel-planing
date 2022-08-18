import React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider, EmotionCache } from '@emotion/react'

import theme from 'configs/theme'
import createEmotionCache from 'configs/createEmotionCache'

import { ApolloClientProvider } from 'contexts/ApolloClientProvider'
import { DirectionServiceProvider } from 'contexts/DirectionServiceProvider'
import { DistanceMatrixProvider } from 'contexts/DistanceMatrixProvider'
import { PlacesServiceProvider } from 'contexts/PlacesServiceProvider'
import { ConfirmationProvider } from 'contexts/ConfirmationProvider'
import { SelectedSpotsProvider } from 'contexts/SelectedSpotsProvider'
import UserAuthorizationProvider from 'contexts/UserAuthorizationProvider'
import { SpotEditorProvider } from 'contexts/SpotEditorProvider'
import { StringEditorProvider } from 'contexts/StringEditorProvider'

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
        <UserAuthorizationProvider>
          <ThemeProvider theme={theme}>
            <StringEditorProvider>
              <ConfirmationProvider>
                <DirectionServiceProvider>
                  <DistanceMatrixProvider>
                    <PlacesServiceProvider>
                      <SelectedSpotsProvider>
                        <SpotEditorProvider>
                          <CssBaseline />
                          <Component {...pageProps} />
                        </SpotEditorProvider>
                      </SelectedSpotsProvider>
                    </PlacesServiceProvider>
                  </DistanceMatrixProvider>
                </DirectionServiceProvider>
              </ConfirmationProvider>
            </StringEditorProvider>
          </ThemeProvider>
        </UserAuthorizationProvider>
      </ApolloClientProvider>
    </CacheProvider>
  )
}

export default App
