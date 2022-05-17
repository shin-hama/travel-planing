import * as React from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import { PlanningTab } from 'contexts/PlannigTabProvider'

type Props = BoxProps & {
  index: PlanningTab
  value: PlanningTab
}
const TabPanel: React.FC<Props> = ({ children, value, index, ...props }) => {
  return (
    <Box
      width="100%"
      height="100%"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...props}>
      {value === index && children}
    </Box>
  )
}

export default TabPanel
