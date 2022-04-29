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
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import SelectPrefectureDialog, {
  Props,
} from 'components/modules/SelectPrefectureDialog'
import { Prefecture, Plan } from 'contexts/CurrentPlanProvider'
import { useUnsplash } from 'hooks/useUnsplash'
import PlanningLayout from 'components/layouts/PlaningLayout'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { useAsyncFn } from 'react-use'
import AsyncButton from 'components/elements/AsyncButton'
import { useRouter } from 'hooks/useRouter'

type PlanDTO = Pick<Plan, 'title' | 'start' | 'home' | 'destination'>

const PrefectureSelector = () => {
  const router = useRouter()
  const { register, control, handleSubmit } = useForm<PlanDTO>()
  const [, { create: createPlan }] = useTravelPlan()
  const unsplash = useUnsplash()

  const [openDialog, setOpenDialog] = React.useState<Props>({ open: false })

  const handleClick = async () => {
    try {
      return await new Promise<Omit<Prefecture, 'imageUrl'>>(
        (resolve, reject) => {
          setOpenDialog({
            open: true,
            onOK: resolve,
            onClose: reject,
          })
        }
      )
    } finally {
      setOpenDialog({ open: false })
    }
  }

  const [handlerState, handleCreatePlan] = useAsyncFn(
    async (planDTO: PlanDTO) => {
      if (!planDTO?.home || !planDTO?.destination) {
        alert('please select home and destination')
        return
      }

      let homePhoto
      let destPhoto
      try {
        homePhoto = (await unsplash.searchPhoto(planDTO.home.name_en)).urls
          .regular
        destPhoto = (await unsplash.searchPhoto(planDTO.destination.name_en))
          .urls.regular
      } catch {
        // デモバージョンは rate limit が厳しいので、取得できないときは決め打ちで与える
        homePhoto =
          'https://images.unsplash.com/photo-1583839542943-0e5a56d29bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDk2NDl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDcxNTQyOTY&ixlib=rb-1.2.1&q=80&w=1080'
        destPhoto =
          'https://images.unsplash.com/photo-1583839542943-0e5a56d29bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDk2NDl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDcxNTQyOTY&ixlib=rb-1.2.1&q=80&w=1080'
      }

      const newPlan: Parameters<typeof createPlan>[number] = {
        title: planDTO.title,
        start: planDTO.start,
        startTime: dayjs(planDTO.start).hour(8).minute(30).second(0).toDate(),
        end: dayjs(planDTO.start).hour(8).minute(30).second(0).toDate(),
        thumbnail: destPhoto,
        home: { ...planDTO.home, imageUrl: homePhoto },
        destination: { ...planDTO.destination, imageUrl: destPhoto },
        waypoints: [],
        routes: [],
        belongings: [],
      }
      const id = await createPlan(newPlan)

      if (id) {
        router.userPlan(id)
      } else {
        router.push('plan')
      }
    },
    [createPlan, router, unsplash]
  )

  return (
    <PlanningLayout>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <Container maxWidth="xs">
          <Box
            sx={{
              mt: 2,
              ml: 2,
            }}>
            <Typography variant="h4">旅程の作成</Typography>
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
                      color="secondary"
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
                      color="secondary"
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
                defaultValue={new Date()}
                render={({ field }) => (
                  <MobileDatePicker
                    label="出発日"
                    inputFormat="YYYY/MM/DD"
                    mask={'____/__/__'}
                    value={field.value}
                    okText={<Button variant="contained">OK</Button>}
                    cancelText={
                      <Typography variant="button" color="secondary">
                        Cancel
                      </Typography>
                    }
                    onChange={(e) => field.onChange(dayjs(e).toDate())}
                    renderInput={(params) => <TextField {...params} />}
                  />
                )}></Controller>
              <AsyncButton
                loading={handlerState.loading}
                variant="contained"
                type="submit">
                {"Let's Start Planning"}
              </AsyncButton>
            </Stack>
          </form>
          <SelectPrefectureDialog {...openDialog} />
        </Container>
      </LocalizationProvider>
    </PlanningLayout>
  )
}

export default PrefectureSelector
