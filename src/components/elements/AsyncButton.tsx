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
    <Box display="grid" alignItems="center" justifyItems="center">
      <CircularProgress
        size="2rem"
        sx={{
          visibility: loading ? 'visible' : 'hidden',
          gridColumn: 1,
          gridRow: 1,
        }}
      />
      <Button
        {...buttonProps}
        sx={{
          visibility: loading ? 'hidden' : 'visible',
          gridColumn: 1,
          gridRow: 1,
        }}>
        {children}
      </Button>
    </Box>
  )
}

export default AsyncButton
