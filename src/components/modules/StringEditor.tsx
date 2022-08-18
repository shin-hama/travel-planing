import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'

type Field = {
  text: string
}
export type StringEditorProps = {
  open: boolean
  defaultValue: string
  onSave: (str: string) => void
  onCancel: () => void
}
const StringEditor: React.FC<StringEditorProps> = ({
  open,
  defaultValue,
  onSave,
  onCancel,
}) => {
  const { register, handleSubmit } = useForm<Field>({
    defaultValues: { text: defaultValue },
  })

  const handleSave = ({ text }: Field) => {
    onSave(text)
  }

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(handleSave)}>
        <DialogContent>
          <TextField {...register('text')} fullWidth autoComplete="off" />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default StringEditor
