import * as React from 'react'
import Stack from '@mui/material/Stack'

import SpotCard from './SpotCard'
import { SpotDTO } from 'hooks/useSchedules'

type Props = {
  spots: Array<SpotDTO>
}
const SpotsList: React.FC<Props> = ({ spots }) => {
  return (
    <Stack spacing={2} m={1}>
      {spots.map((spot, i) => (
        <SpotCard key={`${i}-${spot}`} spot={spot} />
      ))}
    </Stack>
  )
}

export default SpotsList
