import * as React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'

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
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
          {steps.map(step => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <StepperHandlerContext.Provider value={handleNext}>
          {steps[activeStep].content}
        </StepperHandlerContext.Provider>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}>
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 && (
            <Button onClick={handleReset}>Reset</Button>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default RoutePlanner
