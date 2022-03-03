import * as React from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import SelectPrefectureDialog from 'components/organisms/SelectPrefectureDialog'

const PrefectureSelector = () => {
  const [home, setHome] = React.useState('')
  const [destination, setDestination] = React.useState('')

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleSelectPrefecture = () => {
    setHome('selected')
    setDestination('selected')
    setOpen(false)
  }
  return (
    <>
      <Stack alignItems="center" sx={{ height: '100%', pb: 1 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Start / Goal: {home}</Typography>
            <Button onClick={handleOpen}>Select</Button>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Destination: {destination}</Typography>
            <Button onClick={handleOpen}>Select</Button>
          </Stack>
        </Stack>
      </Stack>
      <SelectPrefectureDialog
        open={open}
        onClose={handleClose}
        onOK={handleSelectPrefecture}
      />
    </>
  )
}

export default PrefectureSelector
