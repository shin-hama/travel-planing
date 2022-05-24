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
import { NextMove, RouteGuidanceAvailable } from 'contexts/CurrentPlanProvider'
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
  dest: RouteGuidanceAvailable
  onChange: (next: NextMove, prevId: string) => void
}
const Route: React.FC<Props> = ({ origin, dest, onChange }) => {
  const [selecting, setSelecting] = React.useState(false)
  const selected = React.useMemo<TravelMode>(
    () => origin.next?.mode || 'driving',
    [origin.next?.mode]
  )

  const openMap = useOpenMap()
  const { routesApi, loading } = useRoutes()
  const route = routesApi.get({
    from: origin.id,
    to: dest.id,
    mode: selected,
  })

  React.useEffect(() => {
    console.log('updated')
  }, [route])

  React.useEffect(() => {
    if (route) {
      console.log('use route cache')
    } else {
      routesApi.searchRoute(origin, dest, selected)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin.id, dest.id, selected, route])

  const [timeEditing, setTimeEditing] = React.useState(false)

  const handleOpen = React.useCallback(() => {
    setTimeEditing(true)
  }, [])

  React.useEffect(() => {
    if (route) {
      routesApi.add(route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route])

  const handleClick = (value: string) => () => {
    if (selecting) {
      setSelecting(false)
      if (isTravelMode(value)) {
        console.log(value)
        onChange({ id: dest.id, mode: value }, origin.id)
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
            onClick={handleClick(selected)}
            size="small"
            sx={{
              background: (theme) =>
                selecting ? theme.palette.grey[300] : undefined,
            }}>
            <SvgIcon>
              <FontAwesomeIcon
                icon={TravelModes.find((mode) => mode.key === selected)?.icon}
              />
            </SvgIcon>
          </IconButton>
          <Collapse in={selecting} orientation="horizontal">
            <Stack direction="row" alignItems="center">
              {TravelModes.filter(({ key }) => key !== selected).map(
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
          href={openMap(origin, dest, selected)}
          target="_blank"
          rel="noopener noreferrer">
          <SvgIcon fontSize="small">
            <FontAwesomeIcon icon={faDiamondTurnRight} />
          </SvgIcon>
        </IconButton>
      </Stack>
      {route && timeEditing && (
        <RouteEditor
          open={timeEditing}
          onClose={() => setTimeEditing(false)}
          route={route}
        />
      )}
    </>
  )
}

export default Route
