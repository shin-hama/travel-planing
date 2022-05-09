import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

export type Time = {
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
  | {
      type: 'increment'
      unit: keyof Time
    }
  | {
      type: 'decrement'
      unit: keyof Time
    }

const buildTime = (defaultTime?: Time): Time => {
  return {
    hour: defaultTime?.hour || 0,
    minute: defaultTime?.minute || 0,
  }
}

const reducer = (state: Time, action: TimeAction): Time => {
  switch (action.type) {
    case 'hour': {
      let newValue = action.value
      if (newValue > 23) {
        newValue = 23
      } else if (newValue < 0) {
        newValue = 0
      }
      return { ...state, hour: newValue }
    }

    case 'minute': {
      let newValue = action.value
      console.log(newValue)
      if (newValue > 59) {
        newValue = 59
      } else if (newValue < 0) {
        newValue = 0
      }
      return { ...state, minute: newValue }
    }

    case 'increment': {
      if (action.unit === 'hour') {
        let newValue = state.hour + 1
        if (newValue > 23) {
          newValue = 0
        }
        return { ...state, hour: newValue }
      } else if (action.unit === 'minute') {
        if (state.minute >= 59) {
          return {
            ...state,
            hour: state.hour >= 23 ? 0 : state.hour + 1,
            minute: 0,
          }
        } else {
          return { ...state, minute: state.minute + 1 }
        }
      } else {
        throw new Error(`not implemented action: ${action.unit}`)
      }
    }

    case 'decrement': {
      if (action.unit === 'hour') {
        let newValue = state.hour - 1
        if (newValue < 0) {
          newValue = 23
        }
        return { ...state, hour: newValue }
      } else if (action.unit === 'minute') {
        if (state.minute <= 0) {
          return {
            ...state,
            hour: state.hour <= 0 ? 23 : state.hour - 1,
            minute: 59,
          }
        } else {
          return { ...state, minute: state.minute - 1 }
        }
      } else {
        throw new Error(`not implemented action: ${action.unit}`)
      }
    }

    default:
      throw Error(`not implemented action: ${action}`)
  }
}

type Props = {
  value?: Time
  onChange?: (newTime: Time) => void
}
const TimeSelector: React.FC<Props> = ({ onChange, value: defaultTime }) => {
  const [time, setTime] = React.useReducer(reducer, defaultTime, buildTime)

  const handleEditChange =
    (type: keyof Time) =>
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const value = Number.parseInt(e.target.value)
      if (value && value > 0) {
        setTime({ type, value })
      } else {
        setTime({ type, value: 0 })
      }
    }

  const handleUp = (unit: keyof Time) => () => {
    setTime({ type: 'increment', unit })
  }

  const handleDown = (unit: keyof Time) => () => {
    setTime({ type: 'decrement', unit })
  }

  React.useEffect(() => {
    onChange?.(time)
  }, [onChange, time])

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Stack id="hour-picker">
        <IconButton onClick={handleUp('hour')}>
          <SvgIcon>
            <FontAwesomeIcon icon={faAngleUp} />
          </SvgIcon>
        </IconButton>
        <TextField
          size="small"
          value={time.hour}
          onChange={handleEditChange('hour')}
          inputProps={{ maxLength: 2, style: { textAlign: 'center' } }}
          sx={{ width: '3rem' }}
        />
        <IconButton onClick={handleDown('hour')}>
          <SvgIcon>
            <FontAwesomeIcon icon={faAngleDown} />
          </SvgIcon>
        </IconButton>
      </Stack>
      <Typography>:</Typography>
      <Stack id="minute-picker">
        <IconButton onClick={handleUp('minute')}>
          <SvgIcon>
            <FontAwesomeIcon icon={faAngleUp} />
          </SvgIcon>
        </IconButton>
        <TextField
          size="small"
          value={time.minute}
          onChange={handleEditChange('minute')}
          inputProps={{ maxLength: 2, style: { textAlign: 'center' } }}
          sx={{ width: '3rem' }}
        />
        <IconButton onClick={handleDown('minute')}>
          <SvgIcon>
            <FontAwesomeIcon icon={faAngleDown} />
          </SvgIcon>
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default TimeSelector
