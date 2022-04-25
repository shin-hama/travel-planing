import * as React from 'react'
import Button from '@mui/material/Button'

import { useWaypoints } from 'hooks/useWaypoints'
import { Spot } from 'contexts/CurrentPlanProvider'

type Props = {
  spotDTO: Spot
}
const AddSpotButton: React.FC<Props> = ({ spotDTO }) => {
  const [waypoints, actions] = useWaypoints()

  const selected = waypoints?.find((item) => item.id === spotDTO.id)

  const handleClick = () => {
    if (selected) {
      actions.remove(spotDTO.id)
    } else {
      actions.add(spotDTO)
    }
  }

  return (
    <Button variant="contained" size="small" onClick={handleClick}>
      {selected ? 'Remove' : 'Add'}
    </Button>
  )
}

export default AddSpotButton
