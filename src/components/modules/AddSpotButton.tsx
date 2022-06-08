import * as React from 'react'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import { v4 as uuidv4 } from 'uuid'

import { Spot } from 'contexts/CurrentPlanProvider'
import { useWaypoints } from 'hooks/useWaypoints'

type Props = {
  newSpot: Omit<Spot, 'id'> & { id?: string | null }
  disabled?: boolean
}
const AddSpotButton: React.FC<Props> = ({ newSpot, disabled = false }) => {
  const [waypoints, actions] = useWaypoints()
  const [day, setDay] = React.useState(1)

  const handleChange = (event: SelectChangeEvent<number>) => {
    setDay(event.target.value as number)
  }

  const selected = waypoints?.find((spot) => spot.id === newSpot.id)

  const handleClick = () => {
    if (selected) {
      actions.remove(selected.id)
    } else {
      actions.add({ ...newSpot, id: newSpot.id || uuidv4() })
    }
  }

  return (
    <Stack direction="row" spacing={1}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={day}
          label="Age"
          onChange={handleChange}>
          <MenuItem value={1}>1日目</MenuItem>
          <MenuItem value={2}>2日目</MenuItem>
          <MenuItem value={3}>3日目</MenuItem>
        </Select>
      </FormControl>
      <Button
        disabled={disabled}
        variant="contained"
        size="small"
        onClick={handleClick}>
        {selected ? 'Remove' : 'Add'}
      </Button>
    </Stack>
  )
}

export default AddSpotButton
