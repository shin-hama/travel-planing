import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
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
            <StepperHandlerContext.Provider value={setStep}>
              {steps[activeStep]}
            </StepperHandlerContext.Provider>
          </Box>
        </Box>
        {activeStep !== 'Home' && (
          <Stack direction="row">
            <Button
              color="inherit"
              onClick={() => setStep('Home')}
              sx={{ mr: 1 }}>
              <Box pr={1}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </Box>
              Home
            </Button>
          </Stack>
        )}
      </Box>
    </Div100vh>
  )
}

export default PlaningMain
