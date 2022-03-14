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

import { useSelectSpots } from 'hooks/useSelectSpots'
import { SpotEvent } from 'contexts/ScheduleEventsProvider'

type Props = {
  event: SpotEvent
}
const EventToolbar: React.FC<Props> = ({ event }) => {
  const spotsApi = useSelectSpots()

  const handleUp = async () => {
    console.log('up')
    const selectedSpot = spotsApi.get<SpotEvent>(event.id, 'spot')
    if (selectedSpot === undefined) {
      console.error('cannot find selected spot')
      return
    }

    const beforeSpot = spotsApi.getPrevSpot(selectedSpot)
    // 直前のスポットがないもしくはホームの場合は移動不可
    if (!beforeSpot || beforeSpot.id === 'start') {
      console.log('cannot move up event')
      return
    }
    spotsApi.swap(beforeSpot, selectedSpot)
  }

  const handleDown = async () => {
    console.log('down')
    const selectedSpot = spotsApi.get<SpotEvent>(event.id, 'spot')
    if (selectedSpot === undefined) {
      console.error('cannot find selected spot')
      return
    }

    const afterSpot = spotsApi.getNextSpot(selectedSpot)
    // 直前に移動イベントがない場合は移動不可
    if (!afterSpot || afterSpot.id === 'end') {
      console.log('cannot move up event')
      return
    }
    spotsApi.swap(selectedSpot, afterSpot)
  }

  const handleEdit = () => {
    console.log('edit')
  }

  const handleRemove = () => {
    spotsApi.remove(event)
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ backgroundColor: 'lightgray', width: '100%', px: 1 }}>
      <IconButton onClick={handleUp}>
        <FontAwesomeIcon icon={faArrowUp} />
      </IconButton>
      <IconButton onClick={handleDown}>
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
