import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Div100vh from 'react-div-100vh'

import RouteViewer from './RouteViewer'
import PrefectureSelector from './PrefectureSelector'
import FeaturedPlaces from './FeaturedPlaces'

export const StepperHandlerContext = React.createContext<() => void>(() => {
  throw Error('StepperHandlerContext is not wrapped')
})

type StepContent = {
  label: string
  content: React.ReactNode
}
const steps: Array<StepContent> = [
  { label: 'Select a Prefecture', content: <PrefectureSelector /> },
  { label: 'Select Spots', content: <FeaturedPlaces /> },
  { label: 'Route Plan', content: <RouteViewer /> },
]

const RoutePlanner = () => {
  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
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
            <StepperHandlerContext.Provider value={handleNext}>
              {steps[activeStep].content}
            </StepperHandlerContext.Provider>
          </Box>
        </Box>
        {activeStep === steps.length - 1 && (
          <Stack direction="row">
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}>
              <Box pr={1}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </Box>
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Home</Button>
          </Stack>
        )}
      </Box>
    </Div100vh>
  )
}

export default RoutePlanner
