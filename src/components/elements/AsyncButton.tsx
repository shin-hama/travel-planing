import * as React from 'react'
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
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Button {...buttonProps}>{children}</Button>
      )}
    </>
  )
}

export default AsyncButton
