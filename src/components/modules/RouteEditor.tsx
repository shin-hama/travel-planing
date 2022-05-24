import * as React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'

import { Route, Time } from 'contexts/CurrentPlanProvider'
import { useWaypoints } from 'hooks/useWaypoints'
import TimePicker, { TimeValue } from './TimeSelector'
import { TravelModes } from './Route'
import { useRoutes } from 'hooks/useRoutes'
import { TravelMode } from 'hooks/googlemaps/useDirections'

const convertSecToMin = (value: number) => {
  return Math.floor(value / 60)
}

type Props = DialogProps & {
  route: Route
}
const RouteEditor: React.FC<Props> = ({ route: target, ...props }) => {
  const { routesApi, loading } = useRoutes()
  // const route = routeApi.get(target)
  const [waypoints, waypointsApi] = useWaypoints()
  // 変更内容を反映するために、コンポーネント内で Spot 情報を常に最新で取得する
  const origin = waypoints?.find((item) => item.id === target.from)
  const dest = waypoints?.find((item) => item.id === target.to)

  const handleSelectMode = (key: TravelMode) => () => {
    if (origin?.next && origin.next.mode !== key) {
      waypointsApi.update(origin.id, {
        next: { ...origin.next, mode: key },
      })
    }
  }

  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const handleUpdateTime = (newTime: TimeValue) => {
    if (!target) {
      return
    }

    const hour = newTime.hour !== 0 ? `${newTime.hour} hour` : ''
    const minute = `${newTime.minute} minutes`
    const time: Time = {
      text: `${hour} ${minute}`,
      value: newTime.hour * 60 + newTime.minute,
      unit: 'minute',
    }
    // 連続して保存が実行されないように、タイムアウト処理で管理
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(async () => {
      routesApi.add({ ...target, time: time })
    }, 500)
  }

  const handleResetTime = () => {
    if (origin && dest) {
      routesApi.searchRoute(origin, dest, target.mode)
    }
  }

  const handleUpdateMemo = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // 連続して保存が実行されないように、タイムアウト処理で管理
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(async () => {
      routesApi.add({ ...target, memo: e.target.value })
    }, 500)
  }

  return (
    <Dialog {...props} maxWidth="sm" fullWidth>
      <DialogContent>
        <Stack spacing={4}>
          <Typography variant="h4" noWrap>
            {origin?.name} to {dest?.name}
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Stack direction="row" spacing={1}>
              <Stack direction="row">
                {TravelModes.map(({ key, icon }) => (
                  <IconButton
                    key={key}
                    size="small"
                    onClick={handleSelectMode(key)}>
                    <SvgIcon>
                      <FontAwesomeIcon icon={icon} />
                    </SvgIcon>
                  </IconButton>
                ))}
              </Stack>
              <TimePicker
                value={
                  target.time?.unit === 'second'
                    ? convertSecToMin(target.time.value || 0)
                    : target.time?.value
                }
                onChange={handleUpdateTime}
              />
              <Button
                variant="outlined"
                onClick={handleResetTime}
                startIcon={
                  <SvgIcon>
                    <FontAwesomeIcon icon={faRotateRight} />
                  </SvgIcon>
                }>
                Reset Time
              </Button>
            </Stack>
          )}
          <Stack spacing={1}>
            <Typography variant="h5">メモ</Typography>
            <TextField
              value={target.memo}
              onChange={handleUpdateMemo}
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
