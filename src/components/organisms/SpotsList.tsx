import * as React from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import SpotCard from './SpotCard'
import {
  SelectedPlacesContext,
  useSelectedPlacesActions,
} from 'contexts/SelectedPlacesProvider'

type ButtonProps = {
  placeId: string
}
const SelectButton: React.FC<ButtonProps> = ({ placeId }) => {
  const selectedSpots = React.useContext(SelectedPlacesContext)
  const actions = useSelectedPlacesActions()

  const isSelected = selectedSpots.some(item => item.placeId === placeId)

  const handleClick = () => {
    if (isSelected) {
      actions.filter(item => item.placeId !== placeId)
    } else {
      actions.push({ placeId })
    }
  }

  return (
    <Button
      variant="contained"
      size="small"
      onClick={handleClick}
      sx={{ marginLeft: 'auto' }}>
      {isSelected ? 'Remove' : 'Add'}
    </Button>
  )
}

type Props = {
  spots: Array<string>
}
const SpotsList: React.FC<Props> = ({ spots }) => {
  return (
    <Stack spacing={2}>
      {spots.map(spot => (
        <SpotCard
          key={spot}
          placeId={spot}
          actionNode={<SelectButton placeId={spot} />}
        />
      ))}
    </Stack>
  )
}

export default SpotsList
