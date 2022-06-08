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
  const [day, setDay] = React.useState(0)

  const handleChange = (event: SelectChangeEvent<number>) => {
    setDay(event.target.value as number)
  }

  const selected = waypoints?.find((spot) => spot.id === newSpot.id)

  const handleClick = () => {
    if (selected) {
      actions.remove(selected.id)
    } else {
      actions.add({ ...newSpot, id: newSpot.id || uuidv4() }, day)
    }
  }

  return (
    <Stack direction="row" spacing={1}>
      <FormControl fullWidth>
        <InputLabel id="day-select-label">Day</InputLabel>
        <Select
          labelId="day-select-label"
          id="day-select"
          value={day}
          label="Age"
          onChange={handleChange}>
          {[...Array(actions.getDays())].map((_, i) => (
            <MenuItem key={i} value={i}>
              {i + 1}日目
            </MenuItem>
          ))}
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
