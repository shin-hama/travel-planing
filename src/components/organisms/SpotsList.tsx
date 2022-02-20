import * as React from 'react'
import Stack from '@mui/material/Stack'

import SpotCard from './SpotCard'

type Props = {
  spots: Array<string>
}
const SpotsList: React.FC<Props> = ({ spots }) => {
  return (
    <Stack spacing={2}>
      {spots.map(spot => (
        <SpotCard key={spot} placeId={spot} />
      ))}
    </Stack>
  )
}

export default SpotsList
