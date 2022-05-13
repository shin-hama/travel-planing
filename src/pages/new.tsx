import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
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
import Layout from 'components/layouts/Layout'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { useAsyncFn } from 'react-use'
import AsyncButton from 'components/elements/AsyncButton'
import { useRouter } from 'hooks/useRouter'

type PlanDTO = Pick<Plan, 'title' | 'start' | 'home' | 'destination' | 'days'>
type Form = {
  label: string
  control: React.ReactNode
}

const PrefectureSelector = () => {
  const router = useRouter()
  const { register, control, handleSubmit, watch } = useForm<PlanDTO>()
  const dest = watch('destination')
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

  const forms = React.useMemo<Array<Form>>(
    () => [
      {
        label: '出発地',
        control: (
          <Controller
            control={control}
            name="home"
            render={({ field }) => (
              <Button
                color="primary"
                variant="outlined"
                onClick={async () => field.onChange(await handleClick())}>
                {field.value?.name || 'Select'}
              </Button>
            )}
          />
        ),
      },
      {
        label: '目的地',
        control: (
          <Controller
            control={control}
            name="destination"
            render={({ field }) => (
              <Button
                color="primary"
                variant="outlined"
                onClick={async () => field.onChange(await handleClick())}>
                {field.value?.name || 'Select'}
              </Button>
            )}
          />
        ),
      },
      {
        label: 'プラン名',
        control: (
          <TextField
            fullWidth
            placeholder={dest ? `${dest.name}旅行` : ''}
            variant="outlined"
            defaultValue={''}
            {...register('title')}
          />
        ),
      },
      {
        label: '出発日',
        control: (
          <Stack direction="row" spacing={1}>
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
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              )}
            />
            <TextField
              placeholder="未定"
              variant="outlined"
              type="number"
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
            <Grid
              container
              alignItems="center"
              spacing={1}
              rowSpacing={2}
              sx={{ pt: 3, px: 2 }}>
              {forms.map(({ label, control }) => (
                <React.Fragment key={label}>
                  <Grid item xs={3}>
                    <Typography textAlign="right">{label}:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    {control}
                  </Grid>
                </React.Fragment>
              ))}
              <Grid item xs={12} textAlign="center">
                <AsyncButton
                  fullWidth
                  loading={handlerState.loading}
                  variant="contained"
                  type="submit">
                  {"Let's Start Planning"}
                </AsyncButton>
              </Grid>
            </Grid>
          </form>
          <SelectPrefectureDialog {...openDialog} />
        </Container>
      </LocalizationProvider>
    </Layout>
  )
}

export default PrefectureSelector
