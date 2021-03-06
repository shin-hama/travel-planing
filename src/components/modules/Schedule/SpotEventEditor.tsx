import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Controller, useForm } from 'react-hook-form'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import { Spot } from 'contexts/CurrentPlanProvider'
import SpotLabel from './SpotLabel'
import TimePicker from '../TimeSelector'
import { useConfirm } from 'hooks/useConfirm'

type Forms = Pick<Spot, 'name' | 'duration' | 'labels' | 'memo'>

type Props = DialogProps & {
  spot: Spot
  onUpdate: (spot: Spot) => void
  onDelete: () => void
}
const SpotEventEditor: React.FC<Props> = ({
  spot,
  onUpdate,
  onDelete,
  ...props
}) => {
  const [edited, setEdited] = React.useState<Spot>(spot)
  const confirm = useConfirm()

  const { control, register, watch } = useForm<Forms>({
    defaultValues: {
      name: spot?.name,
      duration: spot?.duration,
      labels: spot?.labels,
      memo: spot?.memo,
    },
  })

  const handleRemove = async () => {
    confirm({
      title: 'このスポット情報を削除しますか?',
      allowClose: true,
      dialogProps: {
        maxWidth: 'xs',
      },
    }).then(() => {
      onDelete()
    })
  }

  const handleClose = () => {
    onUpdate(edited)
  }

  React.useEffect(() => {
    const subscription = watch((value) => {
      setEdited((prev) => ({
        ...prev,
        ...value,
        labels: value.labels?.filter(
          (label): label is string => label !== undefined
        ),
      }))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <Dialog {...props} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Stack spacing={4}>
          <Stack spacing={1}>
            <TextField
              {...register('name')}
              variant="outlined"
              fullWidth
              InputProps={{ sx: (theme) => theme.typography.h4  }}
            />
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle1">滞在時間</Typography>
              <Controller
                control={control}
                name="duration"
                render={({ field }) => (
                  <TimePicker
                    value={field.value}
                    onChange={(time) =>
                      field.onChange(time.hour * 60 + time.minute)
                    }
                  />
                )}
              />
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5">ラベル</Typography>
            <Stack direction="row" spacing={0.5}>
              {edited.labels?.map((label, i) => (
                <Controller
                  key={`${label}-${i}`}
                  control={control}
                  name="labels"
                  render={({ field }) => (
                    <SpotLabel
                      defaultLabel={label}
                      onSave={(newLabel) =>
                        field.onChange(
                          edited.labels?.map((value, index) =>
                            i === index ? newLabel : value
                          )
                        )
                      }
                      onRemove={() =>
                        field.onChange(
                          edited.labels?.filter((_, index) => i !== index)
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
                      field.onChange([...(edited?.labels || []), newLabel])
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
              rows={4}
              placeholder="説明を入力してください"
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={handleRemove}
          startIcon={
            <SvgIcon>
              <FontAwesomeIcon icon={faTrash} />
            </SvgIcon>
          }>
          Delete
        </Button>
        <Box flexGrow={1} />
      </DialogActions>
    </Dialog>
  )
}

export default SpotEventEditor
