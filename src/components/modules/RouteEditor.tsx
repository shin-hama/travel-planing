import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Controller, useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { Route } from 'contexts/CurrentPlanProvider'
import { useWaypoints } from 'hooks/useWaypoints'
import TimePicker from './TimeSelector'
import { TravelModes } from './Route'
import { useRoutes } from 'hooks/useRoutes'

const convertSecToMin = (value: number) => {
  return Math.floor(value / 60)
}

type Forms = Pick<Route, 'mode' | 'time' | 'memo'>

type Props = DialogProps & {
  route: Route
}
const RouteEditor: React.FC<Props> = ({ route: target, ...props }) => {
  const routeApi = useRoutes()
  // const route = routeApi.get(target)
  const [waypoints, waypointsApi] = useWaypoints()
  // 変更内容を反映するために、コンポーネント内で Spot 情報を常に最新で取得する
  const origin = waypoints?.find((item) => item.id === target.from)
  const dest = waypoints?.find((item) => item.id === target.to)

  const { control, register, watch } = useForm<Forms>({
    defaultValues: {
      mode: target.mode,
      time: target.time,
      memo: target.memo,
    },
  })

  React.useEffect(() => {
    console.log('test')
  }, [target])

  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  React.useEffect(() => {
    const subscription = watch((value) => {
      // 連続して保存が実行されないように、タイムアウト処理で管理
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(async () => {
        const { mode, time, memo } = value
        if (!mode) {
          return
        }
        if (time && !time.text && !time.value && !time.unit) {
          return
        }

        routeApi.add({ ...target, mode, time: time, memo })
      }, 500)
    })
    return () => subscription.unsubscribe()
  }, [routeApi, target, watch, waypointsApi])

  const handleClick = React.useCallback(
    (key: string) => () => {
      console.log(key)
    },
    []
  )

  return (
    <Dialog {...props} maxWidth="sm" fullWidth>
      <DialogContent>
        <Stack spacing={4}>
          <Typography variant="h4" noWrap>
            {origin?.name} to {dest?.name}
          </Typography>
          <Stack direction="row" spacing={1}>
            {Object.entries(TravelModes).map(([key, icon]) => (
              <IconButton key={key} onClick={handleClick(key)} size="small">
                <SvgIcon>
                  <FontAwesomeIcon icon={icon} />
                </SvgIcon>
              </IconButton>
            ))}
            <Controller
              control={control}
              name="time"
              render={({ field }) => (
                <TimePicker
                  value={
                    field.value?.unit === 'second'
                      ? convertSecToMin(field.value?.value || 0)
                      : field.value?.value
                  }
                  onChange={(newTime) => {
                    const hour =
                      newTime.hour !== 0 ? `${newTime.hour} hour` : ''
                    const minute = `${newTime.minute} minutes`
                    field.onChange({
                      text: `${hour} ${minute}`,
                      value: newTime.hour * 60 + newTime.minute,
                      unit: 'minute',
                    })
                  }}
                />
              )}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5">メモ</Typography>
            <TextField
              {...register('memo')}
              multiline
              rows={4}
              placeholder="説明を入力してください"
            />
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default RouteEditor
