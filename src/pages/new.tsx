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

import { Plan } from 'contexts/CurrentPlanProvider'
import { useUnsplash } from 'hooks/useUnsplash'
import Layout from 'components/layouts/Layout'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { useAsyncFn } from 'react-use'
import AsyncButton from 'components/elements/AsyncButton'
import { useRouter } from 'hooks/useRouter'
import PrefectureSelector from 'components/modules/PrefectureSelector'

type PlanDTO = Pick<Plan, 'title' | 'start' | 'home' | 'destination' | 'days'>
type Form = {
  label?: string
  required?: boolean
  control: React.ReactNode
}

const NewPlan = () => {
  const router = useRouter()
  const { register, control, handleSubmit, watch } = useForm<PlanDTO>()
  const dest = watch('destination')
  const [, { create: createPlan }] = useTravelPlan()
  const unsplash = useUnsplash()

  const forms = React.useMemo<Array<Form>>(
    () => [
      {
        control: (
          <Controller
            control={control}
            name="home"
            render={({ field }) => (
              <PrefectureSelector
                label={'出発地'}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        ),
      },
      {
        control: (
          <Controller
            control={control}
            name="destination"
            render={({ field }) => (
              <PrefectureSelector
                label={'目的地'}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        ),
      },
      {
        control: (
          <TextField
            fullWidth
            size="small"
            label="プラン名"
            placeholder={dest ? `${dest.name}旅行` : '〇〇旅行'}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            defaultValue={''}
            {...register('title')}
          />
        ),
      },
      {
        control: (
          <Stack direction="row" spacing={1} alignItems="center">
            <Controller
              control={control}
              name="start"
              defaultValue={dayjs().add(7, 'day').toDate()}
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
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                />
              )}
            />
            <TextField
              label="日数"
              placeholder="未定"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              type="number"
              size="small"
              InputProps={{ endAdornment: '泊' }}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              defaultValue={null}
              {...register('days')}
            />
          </Stack>
        ),
      },
    ],
    [control, dest, register]
  )

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
        title: planDTO.title || `${planDTO.destination.name}旅行`,
        start: planDTO.start,
        startTime: dayjs(planDTO.start).hour(8).minute(30).second(0).toDate(),
        end: dayjs(planDTO.start).hour(8).minute(30).second(0).toDate(),
        thumbnail: destPhoto,
        home: { ...planDTO.home, imageUrl: homePhoto },
        destination: { ...planDTO.destination, imageUrl: destPhoto },
        belongings: [],
        events: [
          {
            start: dayjs(planDTO.start).hour(9).minute(0).toDate(),
            end: dayjs(planDTO.start).hour(19).minute(0).toDate(),
            spots: [],
          },
        ],
        routes: [],
        days: planDTO.days,
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
    <Layout title="New Plan">
      <LocalizationProvider dateAdapter={DateAdapter}>
        <Container maxWidth="xs">
          <Box sx={{ pt: 2, pb: 3 }}>
            <Typography variant="h4">旅程の作成</Typography>
          </Box>
          <form
            onSubmit={handleSubmit(handleCreatePlan, () => {
              console.log('invalid')
            })}>
            <Stack spacing={2}>
              {forms.map(({ label, control }, i) => (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  key={`${label}-${i}`}>
                  {label && <Typography textAlign="left">{label}</Typography>}
                  {control}
                </Stack>
              ))}
            </Stack>
            <Box sx={{ pt: 4 }}>
              <AsyncButton
                fullWidth
                size="large"
                loading={handlerState.loading}
                variant="contained"
                type="submit">
                Let&rsquo;s Start Traveling
              </AsyncButton>
            </Box>
          </form>
        </Container>
      </LocalizationProvider>
    </Layout>
  )
}

export default NewPlan
