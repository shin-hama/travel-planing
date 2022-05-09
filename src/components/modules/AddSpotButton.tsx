import * as React from 'react'
import Button from '@mui/material/Button'
import { v4 as uuidv4 } from 'uuid'

import { Spot } from 'contexts/CurrentPlanProvider'
import { useWaypoints } from 'hooks/useWaypoints'

type Props = {
  newSpot: Omit<Spot, 'id'> & { id?: string | null }
  disabled?: boolean
}
const AddSpotButton: React.FC<Props> = ({ newSpot, disabled = false }) => {
  const [waypoints, actions] = useWaypoints()

  const selected = waypoints?.find((spot) => spot.id === newSpot.id)

  const handleClick = () => {
    if (selected) {
      actions.remove(selected.id)
    } else {
      actions.add({ ...newSpot, id: newSpot.id || uuidv4() })
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
