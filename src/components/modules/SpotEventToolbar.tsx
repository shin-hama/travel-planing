import * as React from 'react'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowDown,
  faArrowUp,
  faEdit,
  faRemove,
} from '@fortawesome/free-solid-svg-icons'

import { SpotEvent } from 'hooks/usePlanEvents'
import { useTravelPlan } from 'hooks/useTravelPlan'

type Props = {
  event: SpotEvent
}
const EventToolbar: React.FC<Props> = ({ event }) => {
  const [, planApi] = useTravelPlan()

  const handleMove = (mode: 'up' | 'down') => () => {
    console.log(`move ${mode}`)
    planApi.moveWaypoints(event.extendedProps.placeId, mode)
  }

  const handleEdit = () => {
    console.log('edit')
  }

  const handleRemove = () => {
    planApi.removeWaypoint(event.extendedProps.placeId)
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ backgroundColor: 'lightgray', width: '100%', px: 1 }}>
      <IconButton onClick={handleMove('up')}>
        <FontAwesomeIcon icon={faArrowUp} />
      </IconButton>
      <IconButton onClick={handleMove('down')}>
        <FontAwesomeIcon icon={faArrowDown} />
      </IconButton>
      <IconButton onClick={handleEdit}>
        <FontAwesomeIcon icon={faEdit} />
      </IconButton>
      <div style={{ flexGrow: 1 }} />
      <IconButton onClick={handleRemove}>
        <FontAwesomeIcon icon={faRemove} />
      </IconButton>
    </Stack>
  )
}

export default EventToolbar
