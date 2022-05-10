import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBicycle,
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
import { useOpenMap } from 'hooks/googlemaps/useOpenMap'
import { Spot } from 'contexts/CurrentPlanProvider'

const modes: Record<TravelMode, IconDefinition> = {
  driving: faCar,
  bicycling: faBicycle,
  transit: faTrain,
  walking: faWalking,
}

type Props = {
  origin: Spot
  dest: Spot
}
const Route: React.FC<Props> = ({ origin, dest }) => {
  const [selecting, setSelecting] = React.useState(false)
  const [selected, setSelected] = React.useState<TravelMode>('driving')

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
    search({
      origin,
      destination: dest,
      mode: selected,
    }).then((result) => {
      console.log(result)
      setTime(result?.legs[0].duration.text || 'Not Found')
    })
  }, [search, origin, dest, selected])

  return (
    <Stack direction="row" alignItems="center">
      <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
        <IconButton onClick={handleClick(selected)}>
          <SvgIcon>
            <FontAwesomeIcon icon={modes[selected]} />
          </SvgIcon>
        </IconButton>
        <Collapse in={selecting} orientation="horizontal">
          <Stack direction="row" alignItems="center">
            {Object.entries(modes)
              .filter(([key]) => key !== selected)
              .map(([key, icon]) => (
                <IconButton key={key} onClick={handleClick(key)}>
                  <SvgIcon>
                    <FontAwesomeIcon icon={icon} />
                  </SvgIcon>
                </IconButton>
              ))}
          </Stack>
        </Collapse>
        {loading ? <CircularProgress /> : <Typography>{time}</Typography>}
      </Stack>
      <IconButton
        href={openMap(origin, dest, selected)}
        target="_blank"
        rel="noopener noreferrer">
        <SvgIcon>
          <FontAwesomeIcon icon={faDiamondTurnRight} />
        </SvgIcon>
      </IconButton>
    </Stack>
  )
}

export default Route
