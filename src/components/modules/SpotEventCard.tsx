import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { Spot } from 'contexts/CurrentPlanProvider'
import { useWaypoints } from 'hooks/useWaypoints'

type Props = {
  spot: Spot
}
const SpotEventCard: React.FC<Props> = ({ spot }) => {
  const [waypoints, waypointsApi] = useWaypoints()

  const handleMove = React.useCallback(
    (mode: 'up' | 'down') => () => {
      if (waypoints) {
        console.log(`move ${mode}`)

        const index = waypoints.findIndex((point) => spot.id === point.id)
        if (index !== -1) {
          const target = mode === 'up' ? index - 1 : index + 1

          waypointsApi.swap(index, target)
        } else {
          console.error('cannot find target event')
        }
      }
    },
    [spot.id, waypoints, waypointsApi]
  )

  const handleRemove = React.useCallback(() => {
    waypointsApi.remove(spot.id)
  }, [spot.id, waypointsApi])

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{spot.name}</Typography>
      </CardContent>
    </Card>
  )
}

export default SpotEventCard
