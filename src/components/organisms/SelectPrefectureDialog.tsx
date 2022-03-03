import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Stack from '@mui/material/Stack'

import JapanMap from 'components/atoms/JapanMap'

type Props = {
  open: boolean
  onOK: () => void
  onClose: () => void
}
const SelectPrefectureDialog: React.FC<Props> = ({ open, onOK, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogContent>
        <Stack alignItems="center" sx={{ height: '100%', pb: 1 }}>
          <JapanMap />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onOK}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SelectPrefectureDialog
