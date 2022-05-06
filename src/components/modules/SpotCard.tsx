import * as React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import Image from 'next/image'

import AddSpotButton from './AddSpotButton'
import { Spot } from 'contexts/CurrentPlanProvider'
import { usePlaces } from 'hooks/googlemaps/usePlaces'

export type SpotDTO = Pick<Spot, 'name' | 'placeId' | 'lat' | 'lng'> & {
  id?: string | null
}

type Props = {
  spot: SpotDTO
}
const SpotCard: React.FC<Props> = ({ spot }) => {
  const placesService = usePlaces()
  const [photos, setPhotos] = React.useState<Array<string>>([])

  const countRef = React.useRef(0)
  React.useEffect(() => {
    countRef.current = 0
  }, [])

  React.useEffect(() => {
    if (!placesService.isLoaded) {
      return
    }
    if (countRef.current !== 0) {
      return
    }
    countRef.current += 1

    if (spot.placeId) {
      placesService.getPhotos(spot.placeId).then((results) => {
        setPhotos(results)
      })
    }

    return () => {
      setPhotos([])
    }
  }, [spot.placeId, placesService])

  return (
    <Card>
      <Grid container>
        <Grid item xs={8}>
          <CardContent sx={{ pb: 1 }}>
            <Typography variant="h6" noWrap>
              {spot.name}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton
              href={`https://www.instagram.com/explore/tags/${spot.name}`}
              target="_blank"
              rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </IconButton>
            <div style={{ marginLeft: 'auto' }}>
              <AddSpotButton
                newSpot={{
                  ...spot,
                  imageUrl: photos[0] || '',
                  duration: 60,
                  durationUnit: 'minute',
                }}
              />
            </div>
          </CardActions>
        </Grid>
        <Grid item xs={4}>
          {photos.length > 0 && (
            <Image
              src={photos[0]}
              width={200}
              height={200}
              layout="responsive"
              objectFit="cover"
            />
          )}
        </Grid>
      </Grid>
    </Card>
  )
}

export default SpotCard
