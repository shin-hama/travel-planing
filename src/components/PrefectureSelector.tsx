import * as React from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import SelectPrefectureDialog from 'components/organisms/SelectPrefectureDialog'
import { StepperHandlerContext } from './RoutePlanner'
import {
  Prefecture,
  SelectedPrefectureContext,
  SetSelectedPrefectureContext,
} from 'contexts/SelectedPrefectureProvider'

const PrefectureSelector = () => {
  const handleNext = React.useContext(StepperHandlerContext)
  const selected = React.useContext(SelectedPrefectureContext)
  const setSelected = React.useContext(SetSelectedPrefectureContext)

  const [mode, setMode] = React.useState<
    keyof NonNullable<typeof selected> | null
  >(null)
  const handleClose = () => {
    setMode(null)
  }
  const handleSelectPrefecture = (prefecture: Prefecture) => {
    if (mode) {
      setSelected((prev) => ({ ...prev, [mode]: prefecture }))
    }
    setMode(null)
  }

  return (
    <>
      <Stack alignItems="center" sx={{ height: '100%', pb: 1 }}>
        <div style={{ marginTop: '10px', marginBottom: '26px' }}>
          <Typography variant="h3">Travel Planner</Typography>
        </div>
        <Stack spacing={4}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Home: {selected.home?.name}</Typography>
            <Button variant="outlined" onClick={() => setMode('home')}>
              Select
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Destination: {selected.destination?.name}</Typography>
            <Button variant="outlined" onClick={() => setMode('destination')}>
              Select
            </Button>
          </Stack>
          <Button
            disabled={!selected.destination}
            variant="contained"
            onClick={handleNext}>
            Plan Your Trip
          </Button>
        </Stack>
      </Stack>
      <SelectPrefectureDialog
        open={mode !== null}
        onClose={handleClose}
        onOK={handleSelectPrefecture}
      />
    </>
  )
}

export default PrefectureSelector
