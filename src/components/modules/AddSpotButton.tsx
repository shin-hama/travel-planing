import * as React from 'react'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'

import { Spot } from 'contexts/CurrentPlanProvider'
import { usePlanViewConfig } from 'contexts/PlanViewConfigProvider'
import { useSchedules } from 'hooks/useSchedules'

type Props = {
  newSpot: Spot
  disabled?: boolean
}
const AddSpotButton: React.FC<Props> = ({ newSpot, disabled = false }) => {
  const [schedules, actions] = useSchedules()
  const [config, setConfig] = usePlanViewConfig()
  const [day, setDay] = React.useState(config.lastAddDay)
  console.log(schedules)
  const handleChange = (event: SelectChangeEvent<number>) => {
    const newDay = event.target.value as number
    setDay(newDay)

    setConfig({ lastAddDay: newDay })
  }

  const handleClick = async () => {
    await actions.addSpot(newSpot, day)
  }

  return (
    <Stack direction="row" spacing={1}>
      <FormControl fullWidth>
        <InputLabel id="day-select-label">Day</InputLabel>
        <Select
          labelId="day-select-label"
          id="day-select"
          size="small"
          value={day}
          label="Age"
          onChange={handleChange}>
          {[...Array(schedules?.size)].map((_, i) => (
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
        Add
      </Button>
    </Stack>
  )
}

export default AddSpotButton
