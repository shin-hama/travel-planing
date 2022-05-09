import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'

import TimeSelector, { Time } from 'components/elements/TimeSelector'
import PaperPopper from 'components/elements/PaperPopper'

type Props = {
  value?: Time
  onChange?: (newTime: Time) => void
}
const TimePicker: React.FC<Props> = ({ value, onChange }) => {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)
  const theme = useTheme()

  const [time, setTime] = React.useState(
    value || {
      hour: 0,
      minute: 0,
    }
  )

  React.useEffect(() => {
    onChange?.(time)
  }, [onChange, time])

  return (
    <>
      <TextField
        placeholder="HH:MM"
        value={`${time.hour.toString().padStart(2, '0')}:${time.minute
          .toString()
          .padStart(2, '0')}`}
        onClick={(e) => setAnchor(e.currentTarget)}
        inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
        sx={{ width: '5rem' }}
      />
      <PaperPopper
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorEl={anchor}
        placement="bottom-start"
        style={{ zIndex: theme.zIndex.modal + 1 }}>
        <TimeSelector value={time} onChange={setTime} />
      </PaperPopper>
    </>
  )
}

export default TimePicker
