import * as React from 'react'
import Box from '@mui/material/Box'
import Div100vh from 'react-div-100vh'

import Header from 'components/modules/Header'
import PlanViewer from './PlanViewer'
import PrefectureSelector from './PlanConfig'
import FeaturedPlaces from './FeaturedPlaces'
import UserHome from './UserHome'

type Step = 'Home' | 'Config' | 'Map' | 'Schedule'
export const ActiveStepContext = React.createContext<Step>('Home')
export const StepperHandlerContext = React.createContext<
  React.Dispatch<React.SetStateAction<Step>>
>(() => {
  throw new Error('ActiveStepProvider is not wrapped')
})

const steps: Record<Step, React.ReactNode> = {
  Home: <UserHome />,
  Config: <PrefectureSelector />,
  Map: <FeaturedPlaces />,
  Schedule: <PlanViewer />,
}

const PlaningMain = () => {
  const [activeStep, setStep] = React.useState<Step>('Home')

  return (
    <Div100vh style={{ width: '100%' }}>
      <StepperHandlerContext.Provider value={setStep}>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            position: 'relative',
          }}>
          <Header />
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
              {steps[activeStep]}
            </Box>
          </Box>
        </Box>
      </StepperHandlerContext.Provider>
    </Div100vh>
  )
}

export default PlaningMain
