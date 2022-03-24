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

type Props = {
  moveUp: () => void
  moveDown: () => void
  remove: () => void
}
const EventToolbar: React.FC<Props> = ({ moveUp, moveDown, remove }) => {
  const handleEdit = () => {
    console.log('edit')
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ backgroundColor: 'lightgray', width: '100%', px: 1 }}>
      <IconButton onClick={moveUp}>
        <FontAwesomeIcon icon={faArrowUp} />
      </IconButton>
      <IconButton onClick={moveDown}>
        <FontAwesomeIcon icon={faArrowDown} />
      </IconButton>
      <IconButton onClick={handleEdit}>
        <FontAwesomeIcon icon={faEdit} />
      </IconButton>
      <div style={{ flexGrow: 1 }} />
      <IconButton onClick={remove}>
        <FontAwesomeIcon icon={faRemove} />
      </IconButton>
    </Stack>
  )
}

export default EventToolbar
