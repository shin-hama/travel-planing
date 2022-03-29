import * as React from 'react'
import Box from '@mui/material/Box'
import Div100vh from 'react-div-100vh'

import Header from 'components/modules/Header'

const PlanningLayout: React.FC = ({ children }) => {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Div100vh style={{ width: '100%' }}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          position: 'relative',
        }}>
        <Header topLink="/home" />
        <Box
          sx={{
            height: '100%',
            position: 'relative',
            flex: '1 1 0%',
          }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              overflow: 'hidden auto',
            }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Div100vh>
  )
}

export default PlanningLayout
