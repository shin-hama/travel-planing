import * as React from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBicycle,
  faCar,
  faMapLocationDot,
  faTrain,
  faWalking,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

import { TravelMode, isTravelMode } from 'hooks/googlemaps/useDirections'

const modes: Record<TravelMode, IconDefinition> = {
  driving: faCar,
  bicycling: faBicycle,
  transit: faTrain,
  walking: faWalking,
}

const Route = () => {
  const [selecting, setSelecting] = React.useState(false)
  const [selected, setSelected] = React.useState<TravelMode>('driving')

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
        <Typography>10 分</Typography>
      </Stack>
      <IconButton>
        <SvgIcon>
          <FontAwesomeIcon icon={faMapLocationDot} />
        </SvgIcon>
      </IconButton>
    </Stack>
  )
}

export default Route
