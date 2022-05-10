import * as React from 'react'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Controller, useForm } from 'react-hook-form'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { Spot } from 'contexts/CurrentPlanProvider'
import { useWaypoints } from 'hooks/useWaypoints'
import SpotLabel from './SpotLabel'
import TimePicker from './TimePicker'

type Forms = Pick<Spot, 'name' | 'duration' | 'labels' | 'memo'>

type Props = DialogProps & {
  spotId: string
}
const SpotEventEditor: React.FC<Props> = ({ spotId, ...props }) => {
  const [waypoints, waypointsApi] = useWaypoints()
  // 変更内容を反映するために、コンポーネント内で Spot 情報を常に最新で取得する
  const spot = waypoints?.find((item) => item.id === spotId)

  const { control, register, watch } = useForm<Forms>({
    defaultValues: {
      name: spot?.name,
      duration: spot?.duration,
      labels: spot?.labels,
      memo: spot?.memo,
    },
  })

  React.useEffect(() => {
    const subscription = watch((value) => {
      waypointsApi.update(spotId, {
        ...value,
        labels: value.labels?.filter(
          (label): label is string => typeof label === 'string'
        ),
      })
    })
    return () => subscription.unsubscribe()
  }, [spotId, watch, waypointsApi])

  return (
    <Dialog {...props} maxWidth="sm" fullWidth>
      <DialogContent>
        <Stack spacing={4}>
          <Stack spacing={1}>
            <TextField
              {...register('name')}
              variant="outlined"
              fullWidth
              InputProps={{ sx: (theme) => theme.typography.h3 }}
            />
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">MM-DD</Typography>
              <Controller
                control={control}
                name="duration"
                render={({ field }) => (
                  <TimePicker value={field.value} onChange={field.onChange} />
                )}
              />
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5">ラベル</Typography>
            <Stack direction="row" spacing={0.5}>
              {spot?.labels?.map((label, i) => (
                <Controller
                  key={`${label}-${i}`}
                  control={control}
                  name="labels"
                  render={({ field }) => (
                    <SpotLabel
                      defaultLabel={label}
                      onSave={(newLabel) =>
                        field.onChange(
                          spot.labels?.map((value, index) =>
                            i === index ? newLabel : value
                          )
                        )
                      }
                      onRemove={() =>
                        field.onChange(
                          spot.labels?.filter((_, index) => i !== index)
                        )
                      }>
                      <Typography>{label}</Typography>
                    </SpotLabel>
                  )}
                />
              ))}
              <Controller
                control={control}
                name="labels"
                render={({ field }) => (
                  <SpotLabel
                    onSave={(newLabel) =>
                      field.onChange([...(spot?.labels || []), newLabel])
                    }>
                    <SvgIcon fontSize="small">
                      <FontAwesomeIcon icon={faPlus} />
                    </SvgIcon>
                  </SpotLabel>
                )}
              />
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5">メモ</Typography>
            <TextField
              {...register('memo')}
              multiline
              placeholder="説明を入力してください"
            />
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default SpotEventEditor
