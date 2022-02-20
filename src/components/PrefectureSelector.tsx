import * as React from 'react'
import Stack from '@mui/material/Stack'

// import JapanMap from './atoms/JapanMap'
import PlanEditor from './organisms/PlanEditor'

const PrefectureSelector = () => {
  return (
    <Stack alignItems="center" sx={{ height: '100%', pb: 1 }}>
      <PlanEditor />
      {/* <JapanMap /> */}
    </Stack>
  )
}

export default PrefectureSelector
