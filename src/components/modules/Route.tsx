import * as React from 'react'
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

import {
  TravelMode,
  isTravelMode,
  useDirections,
} from 'hooks/googlemaps/useDirections'
import { useRoutes } from 'hooks/useRoutes'
import { useOpenMap } from 'hooks/googlemaps/useOpenMap'
import { Spot } from 'contexts/CurrentPlanProvider'
import { useWaypoints } from 'hooks/useWaypoints'

const modes: Record<TravelMode, IconDefinition> = {
  driving: faCar,
  transit: faTrain,
  bicycling: faPersonBiking,
  walking: faWalking,
}

type Props = {
  origin: Spot
  dest: Spot
}
const Route: React.FC<Props> = ({ origin, dest }) => {
  const [selecting, setSelecting] = React.useState(false)
  const [selected, setSelected] = React.useState<TravelMode>(
    origin.next?.mode || 'driving'
  )

  const routesApi = useRoutes()
  const [, waypointsApi] = useWaypoints()
  const { search, loading } = useDirections()
  const [time, setTime] = React.useState('')

  const openMap = useOpenMap()

  const handleClick = (value: string) => () => {
    if (selecting) {
      setSelecting(false)
      if (isTravelMode(value)) {
        setSelected(value)
      }
    } else {
      setSelecting(true)
    }
  }

  React.useEffect(() => {
    if (origin.next?.mode !== selected) {
      console.log('update travel mode')
      waypointsApi.update(origin.id, {
        next: { id: dest.id, mode: selected },
      })
    }
  }, [dest.id, origin.id, origin.next, selected, waypointsApi])

  React.useEffect(() => {
    const routeCache = routesApi.get({
      from: origin.id,
      to: dest.id,
      mode: selected,
    })
    if (routeCache?.time) {
      console.log('use route cache')
      setTime(routeCache.time.text)
    } else {
      search({
        origin,
        destination: dest,
        mode: selected,
      }).then((result) => {
        console.log('Calc route')
        setTime(result?.legs[0].duration.text || 'Not Found')
        routesApi.add({
          from: origin.id,
          to: dest.id,
          mode: selected,
          time: result && { ...result.legs[0].duration, unit: 'second' },
        })
      })
    }
  }, [origin.id, dest.id, selected])

  return (
    <Stack direction="row" alignItems="center" px={3}>
      <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
        <IconButton onClick={handleClick(selected)} size="small">
          <SvgIcon>
            <FontAwesomeIcon icon={modes[selected]} />
          </SvgIcon>
        </IconButton>
        <Collapse in={selecting} orientation="horizontal">
          <Stack direction="row" alignItems="center">
            {Object.entries(modes)
              .filter(([key]) => key !== selected)
              .map(([key, icon]) => (
                <IconButton key={key} onClick={handleClick(key)} size="small">
                  <SvgIcon>
                    <FontAwesomeIcon icon={icon} />
                  </SvgIcon>
                </IconButton>
              ))}
          </Stack>
        </Collapse>
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography variant="body2">{time}</Typography>
        )}
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
  )
}

export default Route
