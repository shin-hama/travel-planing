import * as React from 'react'
import Button from '@mui/material/Button'
import { v4 as uuidv4 } from 'uuid'

import { useWaypoints } from 'hooks/useWaypoints'
import { Spot } from 'contexts/CurrentPlanProvider'

type Props = {
  newSpot: Omit<Spot, 'id'>
  disabled?: boolean
}
const AddSpotButton: React.FC<Props> = ({ newSpot, disabled = false }) => {
  const [waypoints, actions] = useWaypoints()

  const selected = waypoints?.find(
    (item) => item.placeId && item.placeId === newSpot.placeId
  )

  const handleClick = () => {
    if (selected) {
      actions.remove(selected.id)
    } else {
      actions.add({ ...newSpot, id: uuidv4() })
    }
  }

  return (
    <Button
      disabled={disabled}
      variant="contained"
      size="small"
      onClick={handleClick}>
      {selected ? 'Remove' : 'Add'}
    </Button>
  )
}

export default AddSpotButton
