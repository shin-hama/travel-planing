import * as React from 'react'
import Box from '@mui/material/Box'
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
import { usePlaces } from 'hooks/googlemaps/usePlaces'
import { SpotDTO } from 'hooks/useSchedules'

type Props = {
  spot: SpotDTO
}
const SpotCard: React.FC<Props> = ({ spot }) => {
  const placesService = usePlaces()
  const [photo, setPhoto] = React.useState<string>('')

  const countRef = React.useRef(0)
  React.useEffect(() => {
    countRef.current = 0
  }, [])

  React.useEffect(() => {
    if (countRef.current !== 0) {
      return
    }
    countRef.current += 1

    if (spot.placeId) {
      placesService.getPhotos(spot.placeId).then((image) => {
        setPhoto(image)
      })
    }

    return () => {
      setPhoto('')
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
            <Box ml="auto">
              <AddSpotButton newSpot={spot} />
            </Box>
          </CardActions>
        </Grid>
        <Grid item xs={4}>
          <Image
            src={`data:image/png;base64,${photo}`}
            width={200}
            height={200}
            quality={100}
            layout="responsive"
            objectFit="cover"
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default SpotCard
