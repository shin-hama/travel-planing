import * as React from 'react'
import Box from '@mui/material/Box'

type Props = {
  children: React.ReactNode
}
const Label: React.FC<Props> = ({ children }) => {
  return (
    <Box
      component="button"
      p={1}
      sx={{
        border: 'none',
        borderRadius: 1,
        background: (theme) => theme.palette.grey[200],
        color: (theme) => theme.palette.grey[600],
        '&:hover': {
          background: (theme) => theme.palette.grey[300],
        },
        '&:active': {
          background: (theme) => theme.palette.grey[200],
        },
      }}>
      {children}
    </Box>
  )
}

export default Label
