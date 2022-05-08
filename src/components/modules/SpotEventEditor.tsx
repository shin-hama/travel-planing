import * as React from 'react'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { Spot } from 'contexts/CurrentPlanProvider'
import Label from 'components/elements/Label'

type Props = DialogProps & {
  spot: Spot | null
}
const SpotEventEditor: React.FC<Props> = ({ spot, ...props }) => {
  if (!spot) {
    return <></>
  }

  return (
    <Dialog {...props} maxWidth="sm" fullWidth>
      <DialogContent>
        <Stack spacing={4}>
          <Stack spacing={1}>
            <TextField
              variant="outlined"
              value={spot.name}
              fullWidth
              InputProps={{ sx: (theme) => theme.typography.h3 }}
            />
            <Stack direction="row" spacing={2}>
              <Typography variant="subtitle1">MM-DD</Typography>
              <Typography variant="subtitle1">
                {spot.duration} {spot.durationUnit}
              </Typography>
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
            <TextField multiline placeholder="説明を入力してください" />
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default SpotEventEditor
