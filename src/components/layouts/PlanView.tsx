import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTravelPlan } from 'hooks/useTravelPlan'

const PlanView = () => {
  const [plan] = useTravelPlan()
  return (
    <Box p={6}>
      <Typography>{plan?.title}</Typography>
    </Box>
  )
}

export default PlanView
