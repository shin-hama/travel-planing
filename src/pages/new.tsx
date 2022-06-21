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

import Layout from 'components/layouts/Layout'
import { useAsyncFn } from 'react-use'
import AsyncButton from 'components/elements/AsyncButton'
import { useRouter } from 'hooks/useRouter'
import PrefectureSelector from 'components/modules/PrefectureSelector'
import { PlanDTO, usePlans } from 'hooks/usePlans'
import { useAuthentication } from 'hooks/firebase/useAuthentication'

type Form = {
  label?: string
  required?: boolean
  control: React.ReactNode
}

const NewPlan = () => {
  const router = useRouter()
  const { register, control, handleSubmit, watch } = useForm<PlanDTO>()
  const dest = watch('destination')
  const [, { create: createPlan }] = usePlans()
  const [user] = useAuthentication()

  React.useEffect(() => {
    if (user) {
      router.userHome(true)
    } else {
      router.push('signup')
    }
  }, [user, router])

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
              {...register('days', { valueAsNumber: true })}
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

      const id = await createPlan(planDTO)

      if (id) {
        router.userPlan(id)
      } else {
        router.push('plan')
      }
    },
    [createPlan, router]
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
