import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import PaperPopper from 'components/elements/PaperPopper'
import { Box } from '@mui/material'

export type TimeValue = {
  hour: number
  minute: number
}

type TimeAction =
  | {
      type: 'set'
      value: TimeValue
    }
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
      unit: keyof TimeValue
    }
  | {
      type: 'decrement'
      unit: keyof TimeValue
    }

const buildTime = (defaultTime?: number): TimeValue => {
  return {
    hour: Math.floor((defaultTime || 0) / 60),
    minute: (defaultTime || 0) % 60,
  }
}

const reducer = (state: TimeValue, action: TimeAction): TimeValue => {
  const step = 15
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
        if (state.minute >= 60 - step) {
          return {
            ...state,
            hour: state.hour >= 23 ? 0 : state.hour + 1,
            minute: 0,
          }
        } else {
          return { ...state, minute: state.minute + step }
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
            minute: 60 - step,
          }
        } else {
          return { ...state, minute: state.minute - step }
        }
      } else {
        throw new Error(`not implemented action: ${action.unit}`)
      }
    }

    case 'set':
      return action.value

    default:
      throw Error(`not implemented action: ${action}`)
  }
}

type Props = {
  type?: 'input' | 'text'
  label?: string
  value?: number
  onChange?: (newTime: TimeValue) => void
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onOpenChange?: (open: boolean) => void
}
const TimeSelector: React.FC<Props> = ({
  type = 'input',
  label = '',
  value: defaultTime,
  children,
  onChange,
  onClick,
  onOpenChange,
}) => {
  const [time, setTime] = React.useReducer(reducer, defaultTime, buildTime)
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)
  const theme = useTheme()

  React.useEffect(() => {
    setTime({ type: 'set', value: buildTime(defaultTime) })
  }, [defaultTime])

  React.useEffect(() => {
    onOpenChange?.(Boolean(anchor))
  }, [anchor, onOpenChange])

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setAnchor(e.currentTarget)
      onClick?.(e)
    },
    [onClick]
  )

  const handleEditChange =
    (type: keyof TimeValue) =>
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newValue = Number.parseInt(e.target.value)
      if (newValue && newValue > 0) {
        setTime({ type, value: newValue })
      } else {
        setTime({ type, value: 0 })
      }
    }

  const handleUp = (unit: keyof TimeValue) => () => {
    setTime({ type: 'increment', unit })
  }

  const handleDown = (unit: keyof TimeValue) => () => {
    setTime({ type: 'decrement', unit })
  }

  const mounted = React.useRef(false)
  React.useEffect(() => {
    // 初期化時に無駄な保存処理が走らないようにする
    if (mounted.current) {
      onChange?.(time)
    }
    mounted.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time])

  const display = () => {
    switch (type) {
      case 'text':
        return (
          <Typography onClick={handleClick}>
            {`${label}${time.hour.toString().padStart(2, '0')}:${time.minute
              .toString()
              .padStart(2, '0')}`}
          </Typography>
        )

      case 'input':
        return (
          <TextField
            label={label}
            placeholder="HH:MM"
            value={`${time.hour.toString().padStart(2, '0')}:${time.minute
              .toString()
              .padStart(2, '0')}`}
            onClick={handleClick}
            size="small"
            inputProps={{
              readOnly: true,
              style: { textAlign: 'center' },
            }}
            sx={{ width: '5rem' }}
          />
        )

      default:
        return <></>
    }
  }

  return (
    <>
      {children ? <Box onClick={handleClick}>{children}</Box> : display()}
      <PaperPopper
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorEl={anchor}
        placement="bottom-start"
        style={{ zIndex: theme.zIndex.modal + 1 }}>
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
      </PaperPopper>
    </>
  )
}

export default TimeSelector
