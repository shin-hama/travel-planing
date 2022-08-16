import * as React from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { useFieldArray, useForm } from 'react-hook-form'

const isEmptyOrSpaces = (str: string | null | undefined) => {
  return !str || str.match(/^ *$/) !== null
}

export type KeyValue = {
  key: string
  value: string
}

type KeyValueForm = {
  values: Array<KeyValue>
}

type Props = KeyValueForm & {
  onChange: (changed: Array<KeyValue>) => void
}
const KeyValues: React.FC<Props> = ({ values, onChange }) => {
  const { control, register, watch } = useForm<KeyValueForm>({
    defaultValues: { values: values },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'values',
  })

  const handleAdd = () => {
    append({ key: '', value: '' })
  }

  const handleRemove = (index: number) => () => {
    remove(index)
  }

  React.useEffect(() => {
    const { unsubscribe } = watch((value) => {
      if (value.values) {
        onChange(
          value.values.filter(
            (item): item is KeyValue =>
              item !== undefined &&
              !isEmptyOrSpaces(item.key) &&
              !isEmptyOrSpaces(item.value)
          )
        )
      }
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Stack alignItems="flex-start" spacing={1}>
      {fields.map((field, index) => (
        <Stack
          key={field.id}
          direction="row"
          spacing={1}
          alignItems="center"
          width="100%">
          <TextField
            placeholder="key"
            size="small"
            {...register(`values.${index}.key`)}
          />
          <TextField
            placeholder="value"
            size="small"
            fullWidth
            {...register(`values.${index}.value`)}
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
