import * as React from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'

import { useGetSpotByPkLazyQuery } from 'generated/graphql'
import { usePlaces } from 'hooks/usePlaces'
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
    <Button variant="contained" size="small" onClick={handleClick}>
      {isSelected ? 'Remove' : 'Add'}
    </Button>
  )
}

type Props = {
  placeId: string
  actionNode?: React.ReactNode
}
const SpotCard: React.FC<Props> = React.memo(function SpotCard({
  placeId,
  actionNode,
}) {
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
        .map(types => {
          return types.type.category_types.map(cate => cate.category.name)
        })
        .flat()

      // 重複を削除して表示
      setSubtitle([...new Set(categories)].join(', '))
    }
    func()
  }, [getSpot, placeId])

  React.useEffect(() => {
    if (countRef.current !== 0) {
      return
    }
    countRef.current += 1
    console.log('get photos')

    placesService.getPhotos(placeId).then(results => {
      setPhotos(results)
    })
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
                <SelectButton placeId={data.spots_by_pk.name} />
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
