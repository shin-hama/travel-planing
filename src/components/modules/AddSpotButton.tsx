import * as React from 'react'
import Badge from '@mui/material/Badge'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

import AsyncButton from 'components/elements/AsyncButton'
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
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

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
      setLoading(true)
      await eventsApi.create(newSpot, selectedDay)
    }
    setLoading(false)
    handleTooltipOpen()
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
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
      <Tooltip
        PopperProps={{
          disablePortal: true,
        }}
        onClose={handleTooltipClose}
        open={open}
        leaveDelay={1000}
        disableFocusListener
        disableTouchListener
        placement="top"
        title="Added">
        <Badge badgeContent={count} color="primary">
          <AsyncButton
            loading={loading}
            disabled={disabled}
            variant="contained"
            size="small"
            onClick={handleClick}>
            Add
          </AsyncButton>
        </Badge>
      </Tooltip>
    </Stack>
  )
}

export default AddSpotButton
