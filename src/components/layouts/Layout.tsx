import * as React from 'react'
import Box from '@mui/material/Box'

import Header from 'components/modules/Header'

const Layout: React.FC = ({ children }) => {
  return (
    <Box>
      <Header topLink="/" />
      {children}
    </Box>
  )
}

export default Layout
