import * as React from 'react'
import Button from '@mui/material/Button'
import { v4 as uuidv4 } from 'uuid'

import { Spot } from 'contexts/CurrentPlanProvider'
import { useTravelPlan } from 'hooks/useTravelPlan'

type Props = {
  newSpot: Omit<Spot, 'id'> & { id?: string | null }
  disabled?: boolean
}
const AddSpotButton: React.FC<Props> = ({ newSpot, disabled = false }) => {
  const [plan, planApi] = useTravelPlan()

  const selected = plan?.events
    .map((event) => event.spots)
    .flat()
    .find((spot) => spot.id === newSpot.id)

  const handleClick = () => {
    if (selected) {
      planApi.removeSpot(selected.id)
    } else {
      planApi.addSpot({ ...newSpot, id: newSpot.id || uuidv4() })
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
