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

import { Route } from 'contexts/CurrentPlanProvider'
import TimePicker, { TimeValue } from '../TimeSelector'
import { TravelModes } from './Route'
import { useRoutes } from 'hooks/useRoutes'
import { TravelMode } from 'hooks/googlemaps/useDirections'

const convertSecToMin = (value: number) => {
  return Math.floor(value / 60)
}

type Props = DialogProps & {
  route: Route
  onClose: (newRoute: Route) => void
}
const RouteEditor: React.FC<Props> = ({ route, onClose, ...props }) => {
  const { routesApi, loading } = useRoutes()

  const [edited, setEdited] = React.useState<Route>(route)

  const handleUpdate = (updated: Partial<Route>) => {
    setEdited((prev) => ({
      ...prev,
      ...updated,
    }))
  }

  const handleSelectMode = (key: TravelMode) => async () => {
    const changed = await routesApi.search(route.from, route.to, key)
    handleUpdate(changed)
  }

  const handleUpdateTime = (newTime: TimeValue) => {
    const hour = newTime.hour !== 0 ? `${newTime.hour} hour` : ''
    const minute = `${newTime.minute} minutes`

    handleUpdate({
      time: {
        text: `${hour} ${minute}`,
        value: newTime.hour * 60 + newTime.minute,
        unit: 'minute',
      },
    })
  }

  const handleResetTime = async () => {
    const newTime = await routesApi.searchRoute(
      route.from,
      route.to,
      edited.mode
    )
    handleUpdate({
      time: newTime,
    })
  }

  const handleUpdateMemo = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleUpdate({ memo: e.target.value })
  }

  const handleClose = () => {
    onClose(edited)
  }

  return (
    <Dialog {...props} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Stack spacing={2}>
          <CircularProgress sx={{ display: loading ? 'block' : 'none' }} />
          <Stack
            direction="row"
            alignItems="center"
            sx={{ display: loading ? 'none' : undefined }}>
            <Stack direction="row">
              {TravelModes.map(({ key, icon }) => (
                <IconButton
                  key={key}
                  size="large"
                  color={key === edited.mode ? 'primary' : undefined}
                  onClick={handleSelectMode(key)}>
                  <SvgIcon fontSize={key === edited.mode ? 'large' : 'small'}>
                    <FontAwesomeIcon icon={icon} />
                  </SvgIcon>
                </IconButton>
              ))}
            </Stack>
            <TimePicker
              value={
                edited.time?.unit === 'second'
                  ? convertSecToMin(edited.time.value || 0)
                  : edited.time?.value
              }
              onChange={handleUpdateTime}
            />
            <div style={{ flexGrow: 1 }} />
            <Button
              variant="text"
              onClick={handleResetTime}
              startIcon={
                <SvgIcon>
                  <FontAwesomeIcon icon={faRotateRight} />
                </SvgIcon>
              }>
              Reset Time
            </Button>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5">メモ</Typography>
            <TextField
              value={edited.memo}
              onChange={handleUpdateMemo}
              multiline
              rows={4}
              placeholder="移動に必要な情報を入力してください"
            />
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default RouteEditor
