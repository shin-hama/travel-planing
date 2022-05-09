import * as React from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Paper from '@mui/material/Paper'
import Popper, { PopperProps } from '@mui/material/Popper'

type Props = PopperProps & {
  children: React.ReactNode
  onClose?: (e: MouseEvent | TouchEvent) => void
}
const PaperPopper: React.FC<Props> = ({
  children,
  onClose = () => null,
  ...props
}) => {
  return (
    <Popper {...props}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={{ px: 1, py: 2 }}>{children}</Paper>
      </ClickAwayListener>
    </Popper>
  )
}

export default PaperPopper
