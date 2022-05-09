import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import { useForm } from 'react-hook-form'
import PaperPopper from 'components/elements/PaperPopper'

type Form = {
  label: string
}
type Props = BoxProps & {
  children: React.ReactNode
  onSave: (value: string) => void
  defaultLabel?: string
  onRemove?: () => void
}
const SpotLabel: React.FC<Props> = ({
  onSave,
  children,
  defaultLabel,
  onRemove,
  ...props
}) => {
  const [open, setOpen] = React.useState(false)
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)
  const { register, handleSubmit } = useForm<Form>({
    defaultValues: {
      label: defaultLabel,
    },
  })
  const theme = useTheme()

  const handleSave = (data: Form, e?: React.BaseSyntheticEvent) => {
    e?.preventDefault()
    const newLabel = data.label
    if (newLabel.trim().length > 0) {
      onSave(data.label)
      setOpen(false)
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
      setOpen(false)
    }
  }

  return (
    <>
      <Box
        {...props}
        component="button"
        p={1}
        onClick={(e) => {
          setAnchor(e.currentTarget)
          setOpen((prev) => !prev)
        }}
        sx={{
          border: 'none',
          borderRadius: 1,
          background: (theme) => theme.palette.grey[200],
          color: (theme) => theme.palette.grey[600],
          '&:hover': {
            background: (theme) => theme.palette.grey[300],
          },
          '&:active': {
            background: (theme) => theme.palette.grey[200],
          },
        }}>
        {children}
      </Box>
      <PaperPopper
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchor}
        placement="bottom-start"
        style={{ zIndex: theme.zIndex.modal + 1 }}>
        <form onSubmit={handleSubmit(handleSave)}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TextField
              {...register('label')}
              variant="outlined"
              size="small"
              label="New Label"
            />
            <Button type="submit" variant="contained">
              Add
            </Button>
            {onRemove && (
              <Button variant="outlined" onClick={handleRemove}>
                Remove
              </Button>
            )}
          </Stack>
        </form>
      </PaperPopper>
    </>
  )
}

export default SpotLabel
