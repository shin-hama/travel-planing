import * as React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import PlanEditor from './organisms/PlanEditor'

const RouteViewer = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexFlow: 'column',
        height: '100%',
      }}>
      <Typography variant="h4" component="h2">
        Your travel plan
      </Typography>
      <PlanEditor />
    </Container>
  )
}

export default RouteViewer
