import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Stack from '@mui/material/Stack'

import JapanMap from 'components/atoms/JapanMap'
import { usePrefectures } from 'constant/prefectures'

export type Prefecture = NonNullable<ReturnType<typeof usePrefectures>>[number]

type Props = {
  open: boolean
  onOK: (selected: Prefecture) => void
  onClose: () => void
}
const SelectPrefectureDialog: React.FC<Props> = ({ open, onOK, onClose }) => {
  const prefectures = usePrefectures()

  const handleClick = (prefectureCode: number) => {
    if (!prefectures) {
      return
    }

    const prefecture = prefectures.find((item) => item.code === prefectureCode)
    if (prefecture) {
      onOK(prefecture)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogContent>
        <Stack alignItems="center" sx={{ height: '100%', pb: 1 }}>
          <JapanMap onClickPrefecture={handleClick} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SelectPrefectureDialog
