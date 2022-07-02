import * as React from 'react'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'

import { usePlanViewConfig } from 'contexts/PlanViewConfigProvider'
import { SpotDTO, useSchedules } from 'hooks/useSchedules'
import { useEvents } from 'hooks/useEvents'

type Props = {
  newSpot: SpotDTO
  disabled?: boolean
}
const AddSpotButton: React.FC<Props> = ({ newSpot, disabled = false }) => {
  const [config, setConfig] = usePlanViewConfig()
  const [day, setDay] = React.useState(config.lastAddDay)
  const [schedules] = useSchedules()
  const selectedDay = React.useMemo(
    () => schedules?.docs[day].ref,
    [day, schedules?.docs]
  )
  const [events, eventsApi] = useEvents(selectedDay)

  const count = React.useMemo(
    () =>
      events.filter(
        (e) => e.data().placeId && e.data().placeId === newSpot.placeId
      ).length,
    [events, newSpot]
  )

  const handleChange = (event: SelectChangeEvent<number>) => {
    const newDay = event.target.value as number
    setDay(newDay)

    setConfig({ lastAddDay: newDay })
  }

  const handleClick = async () => {
    if (selectedDay) {
      await eventsApi.create(newSpot, selectedDay)
    }
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
      <Badge badgeContent={count} color="primary">
        <Button
          disabled={disabled}
          variant="contained"
          size="small"
          onClick={handleClick}>
          Add
        </Button>
      </Badge>
    </Stack>
  )
}

export default AddSpotButton
