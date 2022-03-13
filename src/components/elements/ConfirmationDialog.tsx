import React from 'react'
import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

export type DialogOptions = {
  title: string
  description: React.ReactNode
  dialogProps: Omit<DialogProps, 'open'>
  allowClose: boolean
}
export type ConfirmationProps = {
  open: boolean
  options: DialogOptions
  onCancel: () => void
  onConfirm: () => void
  onClose: () => void
}
const ConfirmationDialog: React.FC<ConfirmationProps> = ({
  open,
  options,
  onCancel,
  onConfirm,
  onClose,
}) => {
  const { title, description, dialogProps, allowClose } = options

  return (
    <Dialog
      fullWidth
      {...dialogProps}
      open={open}
      onClose={allowClose ? onClose : undefined}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{description}</DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={onConfirm}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
