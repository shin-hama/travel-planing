import * as React from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

type KeyValue = {
  key: string
  value: string
}

type Props = {
  values: Array<KeyValue>
}
const KeyValues: React.FC<Props> = ({ values }) => {
  return (
    <Stack alignItems="flex-start">
      <Stack direction="row" spacing={1} alignItems="center" width="100%">
        <TextField placeholder="key" size="small"></TextField>
        <TextField placeholder="value" size="small" fullWidth></TextField>
        <IconButton>
          <SvgIcon>
            <FontAwesomeIcon icon={faClose} />
          </SvgIcon>
        </IconButton>
      </Stack>
      <Button>+ Add New</Button>
    </Stack>
  )
}

export default KeyValues
