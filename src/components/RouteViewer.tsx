import * as React from 'react'
import Container from '@mui/material/Container'

import PlanEditor from './organisms/PlanEditor'

const RouteViewer = () => {
  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
      }}>
      <PlanEditor />
    </Container>
  )
}

export default RouteViewer
