import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DateAdapter from '@mui/lab/AdapterDayjs'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import dayjs from 'dayjs'

import SelectPrefectureDialog, {
  Props,
} from 'components/modules/SelectPrefectureDialog'
import { StepperHandlerContext } from './PlaningMain'
import { Prefecture, Plan } from 'contexts/CurrentPlanProvider'
import { usePlanEvents } from 'hooks/usePlanEvents'
import { usePlan } from 'hooks/usePlan'
import { useUnsplash } from 'hooks/useUnsplash'

type PlanDTO = Pick<Plan, 'title' | 'start' | 'home' | 'destination'>

const PrefectureSelector = () => {
  const { register, control, handleSubmit } = useForm<PlanDTO>()
  const setStep = React.useContext(StepperHandlerContext)
  const [, eventsApi] = usePlanEvents()
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

  const handleCreatePlan: SubmitHandler<PlanDTO> = async (planDTO: PlanDTO) => {
    console.log(planDTO)
    if (!planDTO?.home || !planDTO?.destination) {
      alert('please select home and destination')
      return
    }
    eventsApi.init()

    const photo = await unsplash.searchPhoto(planDTO.destination.name)

    const newPlan: Parameters<typeof createPlan>[number] = {
      title: planDTO.title,
      start: planDTO.start,
      end: planDTO.start,
      thumbnail: photo.urls.regular,
      home: planDTO.home,
      destination: planDTO.destination,
    }
    await createPlan(newPlan)

    setStep('Map')
  }

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Container maxWidth="xs">
        <Box
          sx={{
            mt: 2,
            ml: 2,
          }}>
          <Typography variant="h5">旅程を作成する</Typography>
        </Box>
        <form
          style={{ width: '100%' }}
          onSubmit={handleSubmit(handleCreatePlan, () => {
            console.log('invalid')
          })}>
          <Stack alignItems="center" spacing={2} sx={{ pt: 3, px: 2 }}>
            <Box width="100%">
              <TextField
                fullWidth
                label="プラン名"
                variant="outlined"
                defaultValue={'Travel Plan'}
                {...register('title')}
              />
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>出発地:</Typography>
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
              <Typography>目的地:</Typography>
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
            <Controller
              control={control}
              name="start"
              render={({ field }) => (
                <MobileDatePicker
                  label="出発日"
                  inputFormat="YYYY/MM/DD"
                  value={field.value}
                  onChange={(e) => field.onChange(dayjs(e).toDate())}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}></Controller>
            <Button variant="contained" type="submit">
              {"Let's Start Planning"}
            </Button>
          </Stack>
        </form>
        <SelectPrefectureDialog {...openDialog} />
      </Container>
    </LocalizationProvider>
  )
}

export default PrefectureSelector
