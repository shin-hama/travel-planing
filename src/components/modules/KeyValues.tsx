import * as React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

const isEmptyOrSpaces = (str: string | null | undefined) => {
  return !str || str.match(/^ *$/) !== null
}

const Keys = ['住所', 'URL', '電話番号', '営業時間', '料金', '定休日']

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
          <Controller
            control={control}
            name={`values.${index}.key`}
            render={({ field }) => (
              <Autocomplete
                freeSolo
                fullWidth
                options={Keys}
                renderInput={(params) => (
                  <TextField {...params} label="key" size="small" />
                )}
                inputValue={field.value}
                onInputChange={(_, value) => {
                  field.onChange(value || '')
                }}
              />
            )}
          />
          <TextField
            fullWidth
            label="value"
            size="small"
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
