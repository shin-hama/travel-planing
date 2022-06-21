import * as React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import AddSpotButton from '../AddSpotButton'

type Props = {
  lat: number
  lng: number
}
const AnySpotCard: React.FC<Props> = ({ lat, lng }) => {
  const [name, setName] = React.useState('')

  return (
    <Card sx={{ zIndex: 100 }}>
      <CardContent>
        <Typography variant="h6" noWrap>
          New Spot
        </Typography>
        <TextField
          fullWidth
          size="small"
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
              name: name,
              placeId: null,
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
