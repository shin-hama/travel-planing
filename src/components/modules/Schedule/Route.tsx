import * as React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPersonBiking,
  faCar,
  faDiamondTurnRight,
  faTrain,
  faWalking,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

import { TravelMode, isTravelMode } from 'hooks/googlemaps/useDirections'
import { useRoutes } from 'hooks/useRoutes'
import { useOpenMap } from 'hooks/googlemaps/useOpenMap'
import {
  Route,
  RouteGuidanceAvailable,
  SpotBase,
} from 'contexts/CurrentPlanProvider'
import RouteEditor from './RouteEditor'

type ModeIcon = {
  key: TravelMode
  icon: IconDefinition
}
export const TravelModes: Array<ModeIcon> = [
  {
    key: 'driving',
    icon: faCar,
  },
  {
    key: 'transit',
    icon: faTrain,
  },
  {
    key: 'bicycling',
    icon: faPersonBiking,
  },
  {
    key: 'walking',
    icon: faWalking,
  },
]

type Props = {
  origin: RouteGuidanceAvailable
  dest: SpotBase
  onChange: (route: Route) => void
}
const RouteEvent: React.FC<Props> = ({ origin, dest, onChange }) => {
  const [selecting, setSelecting] = React.useState(false)
  const selected = React.useMemo<ModeIcon>(
    () =>
      TravelModes.find((mode) => mode.key === origin.next?.mode) ||
      TravelModes[0],
    [origin.next?.mode]
  )

  const openMap = useOpenMap()
  const { routesApi, loading } = useRoutes()
  const route = React.useMemo(() => origin.next || null, [origin.next])

  React.useEffect(() => {
    const mode = origin.next?.mode || 'driving'
    if (route?.to.lat !== dest.lat || route?.to.lng !== dest.lng) {
      routesApi.search(origin, dest, mode).then((result) => {
        onChange(result)
      })
    }
  }, [dest])

  const [timeEditing, setTimeEditing] = React.useState(false)

  const handleOpen = React.useCallback(() => {
    setTimeEditing(true)
  }, [])

  const handleClose = React.useCallback(
    (newRoute: Route) => {
      onChange(newRoute)
      setTimeEditing(false)
    },
    [onChange]
  )

  const handleClick = (value: string) => () => {
    if (selecting) {
      setSelecting(false)
      if (isTravelMode(value)) {
        console.log(value)
        routesApi.search(origin, dest, value).then((result) => {
          onChange(result)
        })
      }
    } else {
      setSelecting(true)
    }
  }

  return (
    <>
      <Stack direction="row" alignItems="center" px={3}>
        <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
          <IconButton
            onClick={handleClick(selected.key)}
            size="small"
            sx={{
              background: (theme) =>
                selecting ? theme.palette.grey[300] : undefined,
            }}>
            <SvgIcon>
              <FontAwesomeIcon icon={selected.icon} />
            </SvgIcon>
          </IconButton>
          <Collapse in={selecting} orientation="horizontal">
            <Stack direction="row" alignItems="center">
              {TravelModes.filter(({ key }) => key !== selected.key).map(
                ({ key, icon }) => (
                  <IconButton key={key} onClick={handleClick(key)} size="small">
                    <SvgIcon>
                      <FontAwesomeIcon icon={icon} />
                    </SvgIcon>
                  </IconButton>
                )
              )}
            </Stack>
          </Collapse>
          <Box pl={1}>
            {loading || !route?.time ? (
              <CircularProgress />
            ) : (
              <Typography variant="body2" onClick={handleOpen}>
                {route.time.text}
              </Typography>
            )}
          </Box>
        </Stack>
        <IconButton
          size="small"
          href={openMap(origin, dest, selected.key)}
          target="_blank"
          rel="noopener noreferrer">
          <SvgIcon fontSize="small">
            <FontAwesomeIcon icon={faDiamondTurnRight} />
          </SvgIcon>
        </IconButton>
      </Stack>
      {route && timeEditing && (
        <RouteEditor open={timeEditing} onClose={handleClose} route={route} />
      )}
    </>
  )
}

export default RouteEvent
