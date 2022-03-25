import * as React from 'react'
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

type Props = ButtonProps & {
  loading?: boolean
}

const AsyncButton: React.FC<Props> = ({
  loading,
  children,
  ...buttonProps
}) => {
  return (
    <Box display="flex" alignItems="stretch">
      {loading ? (
        <CircularProgress />
      ) : (
        <Button {...buttonProps}>{children}</Button>
      )}
    </Box>
  )
}

export default AsyncButton
