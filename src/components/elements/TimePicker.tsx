import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

type Time = {
  hour: number
  minute: number
}

type TimeAction =
  | {
      type: 'hour'
      value: number
    }
  | {
      type: 'minute'
      value: number
    }

const reducer = (state: Time, action: TimeAction): Time => {
  let newValue = action.value
  console.log(action)
  switch (action.type) {
    case 'hour':
      if (newValue > 23) {
        newValue = 23
      } else if (newValue < 0) {
        newValue = 0
      }
      return { ...state, hour: newValue }

    case 'minute':
      console.log(newValue)
      if (newValue > 59) {
        newValue = 59
      } else if (newValue < 0) {
        newValue = 0
      }
      return { ...state, minute: newValue }

    default:
      throw Error(`not implemented action: ${action.type}`)
  }
}

const TimePicker = () => {
  const [time, setTime] = React.useReducer(reducer, { hour: 0, minute: 0 })

  const handleChange =
    (type: TimeAction['type']) =>
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const value = Number.parseInt(e.target.value)
      if (value && value > 0) {
        setTime({ type, value })
      } else {
        setTime({ type, value: 0 })
      }
    }
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack id="hour-picker">
        <IconButton>
          <SvgIcon>
            <FontAwesomeIcon icon={faAngleUp} />
          </SvgIcon>
        </IconButton>
        <TextField
          size="small"
          value={time.hour}
          onChange={handleChange('hour')}
          sx={{ width: '3rem' }}
        />
        <IconButton>
          <SvgIcon>
            <FontAwesomeIcon icon={faAngleDown} />
          </SvgIcon>
        </IconButton>
      </Stack>
      <Typography>:</Typography>
      <Stack id="minute-picker">
        <IconButton>
          <SvgIcon>
            <FontAwesomeIcon icon={faAngleUp} />
          </SvgIcon>
        </IconButton>
        <TextField
          size="small"
          value={time.minute}
          onChange={handleChange('minute')}
          sx={{ width: '3rem' }}
        />
        <IconButton>
          <SvgIcon>
            <FontAwesomeIcon icon={faAngleDown} />
          </SvgIcon>
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default TimePicker
