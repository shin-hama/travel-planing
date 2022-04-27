import * as React from 'react'
import Stack from '@mui/material/Stack'

import SpotsMap from 'components/modules/SpotsMap'
import PlanningLayout from 'components/layouts/PlaningLayout'
import MapToolbar from 'components/modules/MapToolbar'
import { MapLayerProvider } from 'contexts/MapLayerModeProvider'

const PlanView = () => {
  return (
    <PlanningLayout>
      <Stack
        sx={{
          width: '100%',
          height: '100%',
        }}>
        <MapLayerProvider>
          <SpotsMap />
          <MapToolbar />
        </MapLayerProvider>
      </Stack>
    </PlanningLayout>
  )
}

export default PlanView
