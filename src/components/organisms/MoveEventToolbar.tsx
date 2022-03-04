import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
import { faCar, faWalking } from '@fortawesome/free-solid-svg-icons'
import { EventApi } from '@fullcalendar/react'

import { MoveEvent } from 'contexts/SelectedPlacesProvider'

const menus: Record<string, FontAwesomeIconProps['icon']> = {
  car: faCar,
  walk: faWalking,
}
type Props = {
  event: EventApi & { extendedProps: MoveEvent['extendedProps'] }
}
const MoveEventToolbar: React.FC<Props> = ({ event }) => {
  const [travelMode, setTravelMode] = React.useState<keyof typeof menus>('car')

  const handleClickMode = (mode: keyof typeof menus) => () => {
    setTravelMode(mode)
    console.log(travelMode)
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ backgroundColor: 'lightgray', width: '100%', px: 1 }}>
      {Object.entries(menus).map(([key, icon]) => (
        <IconButton
          color={key === travelMode ? 'primary' : 'inherit'}
          key={key}
          onClick={handleClickMode(key)}>
          <FontAwesomeIcon icon={icon} />
        </IconButton>
      ))}
    </Stack>
  )
}

export default MoveEventToolbar
