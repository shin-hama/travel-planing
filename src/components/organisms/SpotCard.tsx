import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { useGetSpotByPkLazyQuery } from 'generated/graphql'
import { usePlaces } from 'hooks/usePlaces'

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
    <Card
      sx={{
        maxWidth: '360px',
        maxHeight: '120px',
      }}>
      {loading ? (
        <>Now loading...</>
      ) : (
        <Grid container>
          <Grid item xs={8}>
            <CardContent>
              <Typography variant="h5">{data?.spots_by_pk?.name}</Typography>
              <Typography variant="subtitle2">{subtitle}</Typography>
            </CardContent>
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
      )}
    </Card>
  )
})

export default SpotCard
