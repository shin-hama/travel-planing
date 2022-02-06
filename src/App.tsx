import React from 'react'
import { Map } from 'components/atoms'

import './App.css'
import { SelectedPrefectureProvider } from 'contexts/SelectedPrefectureProvider'
import { ApolloClientProvider } from 'contexts/ApolloClientProvider'
import FeaturedPlaces from 'components/FeaturedPlaces'

function App() {
  return (
    <>
      <ApolloClientProvider>
        <SelectedPrefectureProvider>
          <FeaturedPlaces />
          <Map />
        </SelectedPrefectureProvider>
      </ApolloClientProvider>
    </>
  )
}

export default App
