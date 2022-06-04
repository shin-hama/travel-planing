import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import PaperPopper from 'components/elements/PaperPopper'

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
  const [label, setLabel] = React.useState(defaultLabel || '')
  const theme = useTheme()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLabel(e.target.value)
  }

  const handleSave = () => {
    if (label.trim().length > 0) {
      onSave(label)
      setLabel('')
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
        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField
            value={label}
            onChange={handleChange}
            variant="outlined"
            size="small"
            label="New Label"
          />
          <Button variant="contained" onClick={handleSave}>
            Add
          </Button>
          {onRemove && (
            <Button variant="outlined" onClick={handleRemove}>
              Remove
            </Button>
          )}
        </Stack>
      </PaperPopper>
    </>
  )
}

export default SpotLabel
