import * as React from 'react'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Controller, useForm } from 'react-hook-form'

import { Spot } from 'contexts/CurrentPlanProvider'
import Label from 'components/elements/Label'
import { useWaypoints } from 'hooks/useWaypoints'

type Forms = Pick<Spot, 'name' | 'duration' | 'labels' | 'memo'>

type Props = DialogProps & {
  spot: Spot
}
const SpotEventEditor: React.FC<Props> = ({ spot, ...props }) => {
  const [, waypointsApi] = useWaypoints()

  const { control, register, watch } = useForm<Forms>({
    defaultValues: {
      name: spot.name,
      duration: spot.duration,
      labels: spot.labels,
      memo: spot.memo,
    },
  })

  React.useEffect(() => {
    const subscription = watch((value) =>
      waypointsApi.update(spot.id, {
        ...value,
        labels: value.labels?.filter(
          (label): label is string => typeof label === 'string'
        ),
      })
    )
    return () => subscription.unsubscribe()
  }, [spot.id, watch, waypointsApi])

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
                  <Select {...field} size="small">
                    {Array.from(Array(4 * 24)).map((_, i) => (
                      <MenuItem key={i * 15} value={i * 15}>
                        {i * 15}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <Typography variant="subtitle1">{spot.durationUnit}</Typography>
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5">ラベル</Typography>
            <Stack direction="row" spacing={0.5}>
              <Label>
                <SvgIcon fontSize="small">
                  <FontAwesomeIcon icon={faPlus} />
                </SvgIcon>
              </Label>
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
