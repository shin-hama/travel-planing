import * as React from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

type KeyValue = {
  key: string
  value: string
}

type KeyValueForm = {
  information: Array<KeyValue>
}

type Props = {
  values: Array<KeyValue>
}
const KeyValues: React.FC<Props> = ({ values }) => {
  const { register, control } = useForm<KeyValueForm>({
    defaultValues: { information: values },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'information',
  })

  const handleAdd = () => {
    append({ key: '', value: '' })
  }

  const handleRemove = (index: number) => () => {
    remove(index)
  }

  return (
    <Stack alignItems="flex-start" spacing={1}>
      {fields.map((field, index) => (
        <Stack
          key={field.id}
          direction="row"
          spacing={1}
          alignItems="center"
          width="100%">
          <TextField placeholder="key" size="small" defaultValue={field.key} />
          <TextField
            placeholder="value"
            size="small"
            fullWidth
            defaultValue={field.value}
          />
          <IconButton onClick={handleRemove(index)}>
            <SvgIcon>
              <FontAwesomeIcon icon={faClose} />
            </SvgIcon>
          </IconButton>
        </Stack>
      ))}
      <Button onClick={handleAdd}>+ Add New</Button>
    </Stack>
  )
}

export default KeyValues
