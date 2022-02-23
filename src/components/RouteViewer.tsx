import * as React from 'react'
import Container from '@mui/material/Container'

import PlanEditor from './organisms/PlanEditor'

const RouteViewer = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        height: '100%',
      }}>
      <PlanEditor />
    </Container>
  )
}

export default RouteViewer
