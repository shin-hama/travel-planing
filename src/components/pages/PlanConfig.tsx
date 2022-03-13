import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useForm, Controller } from 'react-hook-form'

import SelectPrefectureDialog, {
  Props,
} from 'components/modules/SelectPrefectureDialog'
import { StepperHandlerContext } from './PlaningMain'
import { Prefecture, Plan } from 'contexts/CurrentPlanProvider'
import { useSelectSpots } from 'hooks/useSelectSpots'
import { usePlan } from 'hooks/usePlan'
import { useUnsplash } from 'hooks/useUnsplash'

type PlanDTO = Pick<Plan, 'title' | 'start' | 'home' | 'destination'>

const PrefectureSelector = () => {
  const { register, control, handleSubmit } = useForm<PlanDTO>()
  const setStep = React.useContext(StepperHandlerContext)
  const eventsApi = useSelectSpots()
  const [, { create: createPlan }] = usePlan()
  const unsplash = useUnsplash()

  const [openDialog, setOpenDialog] = React.useState<Props>({ open: false })

  const handleClick = async () => {
    try {
      return await new Promise<Prefecture>((resolve, reject) => {
        setOpenDialog({
          open: true,
          onOK: resolve,
          onClose: reject,
        })
      })
    } finally {
      setOpenDialog({ open: false })
    }
  }

  const handleCreatePlan = async (planDTO: PlanDTO) => {
    if (!planDTO?.home || !planDTO?.destination) {
      alert('please select home and destination')
      return
    }
    eventsApi.init()

    const photo = await unsplash.searchPhotos(planDTO.destination.name)

    const newPlan: Parameters<typeof createPlan>[number] = {
      title: planDTO.title,
      start: new Date(),
      end: new Date(),
      thumbnail: photo.urls.regular,
      home: planDTO.home,
      destination: planDTO.destination,
    }
    await createPlan(newPlan)

    setStep('Map')
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleCreatePlan, () => {
          console.log('invalid')
        })}>
        <Stack alignItems="center" sx={{ height: '100%', pb: 1 }}>
          <Box sx={{ mt: 2, mb: 4 }}>
            <TextField
              fullWidth
              variant="standard"
              defaultValue={'Travel Plan'}
              {...register('title')}
              InputProps={{
                sx: {
                  fontSize: (theme) => theme.typography.h3.fontSize,
                },
              }}
            />
          </Box>
          <Stack spacing={4}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Home:</Typography>
              <Controller
                control={control}
                name="home"
                render={({ field }) => (
                  <Button
                    variant="outlined"
                    onClick={async () => field.onChange(await handleClick())}>
                    {field.value?.name || 'Select'}
                  </Button>
                )}
              />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Destination:</Typography>
              <Controller
                control={control}
                name="destination"
                render={({ field }) => (
                  <Button
                    variant="outlined"
                    onClick={async () => field.onChange(await handleClick())}>
                    {field.value?.name || 'Select'}
                  </Button>
                )}
              />
            </Stack>
            <Button variant="contained" type="submit">
              Plan Your Trip
            </Button>
          </Stack>
        </Stack>
      </form>
      <SelectPrefectureDialog {...openDialog} />
    </>
  )
}

export default PrefectureSelector
