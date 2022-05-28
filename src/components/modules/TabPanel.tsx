import * as React from 'react'
import Box, { BoxProps } from '@mui/material/Box'

type Props<T> = BoxProps & {
  index: T
  value: T
}
const TabPanel = <T,>(props: Props<T>) => {
  const { index, value, children, ...boxProps } = props
  return (
    <Box
      width="100%"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...boxProps}>
      {value === index && children}
    </Box>
  )
}

export default TabPanel
