import * as React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { v4 as uuidv4 } from 'uuid'

import AddSpotButton from './AddSpotButton'

type Props = {
  lat: number
  lng: number
}
const AnySpotCard: React.FC<Props> = ({ lat, lng }) => {
  const [name, setName] = React.useState('')

  const id = React.useMemo(() => uuidv4(), [])

  return (
    <Card sx={{ zIndex: 100 }}>
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="h6" noWrap>
          New Spot
        </Typography>
        <TextField
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={'Enter New Spot Name'}
        />
      </CardContent>
      <CardActions>
        <div style={{ marginLeft: 'auto' }}>
          <AddSpotButton
            disabled={!name.trim()}
            newSpot={{
              id: id,
              name: name,
              placeId: null,
              imageUrl: '',
              duration: 60,
              durationUnit: 'minute',
              lat,
              lng,
            }}
          />
        </div>
      </CardActions>
    </Card>
  )
}

export default AnySpotCard
