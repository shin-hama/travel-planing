import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const PlanEditor = () => {
  return (
    <Box>
      <Box sx={{ borderBottom: 'solid 1px black' }}>
        <Typography>First day</Typography>
      </Box>
      <Grid container>
        <Grid item xs={2}>
          <Box sx={{ borderRight: 'solid 1px black' }}>21:00</Box>
        </Grid>
        <Grid item xs={10}></Grid>
      </Grid>
    </Box>
  )
}

export default PlanEditor
