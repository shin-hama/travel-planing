import * as React from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'

import { useGetSpotByPkLazyQuery } from 'generated/graphql'
import { usePlaces } from 'hooks/googlemaps/usePlaces'
import { useSelectedSpots } from 'hooks/useSelectedSpots'
import { SpotDTO } from 'hooks/usePlanEvents'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { usePlan } from 'hooks/usePlan'

type ButtonProps = {
  spotDTO: SpotDTO
}
const SelectButton: React.FC<ButtonProps> = ({ spotDTO }) => {
  const [plan] = usePlan()
  const [{ waypoints }, actions] = useTravelPlan(plan)
  const [loading, setLoading] = React.useState(false)

  const selected = waypoints.find((item) => item.placeId === spotDTO.placeId)

  const handleClick = () => {
    setLoading(true)
    if (selected) {
      actions.removeWaypoint(spotDTO)
    } else {
      actions.addWaypoint(spotDTO)
    }
    setLoading(false)
  }

  if (loading === true) {
    return (
      <div style={{ display: 'flex' }}>
        <CircularProgress size={28} />
      </div>
    )
  }

  return (
    <Button variant="contained" size="small" onClick={handleClick}>
      {selected ? 'Remove' : 'Add'}
    </Button>
  )
}

type Props = {
  placeId: string
}
const SpotCard: React.FC<Props> = React.memo(function SpotCard({ placeId }) {
  const [getSpot, { data, loading, error }] = useGetSpotByPkLazyQuery()
  const [subtitle, setSubtitle] = React.useState('')
  const placesService = usePlaces()
  const [photos, setPhotos] = React.useState<Array<string>>([])

  const countRef = React.useRef(0)
  React.useEffect(() => {
    countRef.current = 0
  }, [])

  React.useEffect(() => {
    const func = async () => {
      const result = await getSpot({ variables: { place_id: placeId } })

      const categories = result.data?.spots_by_pk?.spots_types
        .map((types) => {
          return types.type.category_types.map((cate) => cate.category.name)
        })
        .flat()

      // 重複を削除して表示
      setSubtitle([...new Set(categories)].join(', '))
    }
    func()
  }, [getSpot, placeId])

  React.useEffect(() => {
    if (!placesService.isLoaded) {
      return
    }
    if (countRef.current !== 0) {
      return
    }
    countRef.current += 1

    placesService.getPhotos(placeId).then((results) => {
      setPhotos(results)
    })

    return () => {
      setPhotos([])
    }
  }, [placeId, placesService])

  if (error) {
    return <Card>Error</Card>
  }

  return (
    <Card>
      {loading ? (
        <>Now loading...</>
      ) : data?.spots_by_pk ? (
        <Grid container>
          <Grid item xs={8}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h6" noWrap>
                {data.spots_by_pk.name}
              </Typography>
              <Typography variant="subtitle2" noWrap>
                {subtitle}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton
                href={`https://www.instagram.com/explore/tags/${data.spots_by_pk.name}`}
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </IconButton>
              <div style={{ marginLeft: 'auto' }}>
                <SelectButton
                  spotDTO={{
                    name: data.spots_by_pk.name,
                    placeId: data.spots_by_pk.place_id,
                    imageUrl: photos[0] || '',
                  }}
                />
              </div>
            </CardActions>
          </Grid>
          <Grid item xs={4}>
            {photos.length > 0 && (
              <CardMedia
                component="img"
                image={photos[0]}
                sx={{
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                }}
              />
            )}
          </Grid>
        </Grid>
      ) : (
        <>No data</>
      )}
    </Card>
  )
})

export default SpotCard
