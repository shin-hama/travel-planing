import * as React from 'react'
import Stack from '@mui/material/Stack'

import JapanMap from './atoms/JapanMap'
import RouteViewer from './RouteViewer'

const PrefectureSelector = () => {
  return (
    <Stack alignItems="center" sx={{ height: '100%', pb: 1 }}>
      <RouteViewer />
      <JapanMap />
    </Stack>
  )
}

export default PrefectureSelector
