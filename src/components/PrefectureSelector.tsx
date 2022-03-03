import * as React from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import SelectPrefectureDialog, {
  Prefecture,
} from 'components/organisms/SelectPrefectureDialog'

const PrefectureSelector = () => {
  const [home, setHome] = React.useState<Prefecture | null>(null)
  const [destination, setDestination] = React.useState<Prefecture | null>(null)

  const [mode, setMode] = React.useState<'home' | 'dest' | null>(null)

  const handleClose = () => {
    setMode(null)
  }
  const handleSelectPrefecture = (selected: Prefecture) => {
    switch (mode) {
      case 'home':
        setHome(selected)
        break
      case 'dest':
        setDestination(selected)
        break
      default:
        break
    }
    setMode(null)
  }

  return (
    <>
      <Stack alignItems="center" sx={{ height: '100%', pb: 1 }}>
        <Stack spacing={4}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Start / Goal: {home?.name}</Typography>
            <Button variant="contained" onClick={() => setMode('home')}>
              Select
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Destination: {destination?.name}</Typography>
            <Button variant="contained" onClick={() => setMode('dest')}>
              Select
            </Button>
          </Stack>
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
