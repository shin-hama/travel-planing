import * as React from 'react'
import Box from '@mui/material/Box'

type Props = {
  index: number
  value: number
}
const TabPanel: React.FC<Props> = ({ children, value, index }) => {
  return (
    <Box
      width="100%"
      height="100%"
      role="tabpanel"
      position="absolute"
      overflow="hidden auto"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}>
      {value === index && children}
    </Box>
  )
}

export default TabPanel
