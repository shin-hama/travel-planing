import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useGetSpotByPkLazyQuery } from 'generated/graphql'
import { usePlaces } from 'hooks/usePlaces'

type Props = {
  placeId: string
}
const SpotCard: React.FC<Props> = ({ placeId }) => {
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
      console.log(result)

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

    placesService.getPhotos(placeId).then(results => {
      setPhotos(results)
    })
  }, [placeId, placesService])

  React.useEffect(() => {
    console.log(photos)
  }, [photos])

  if (error) {
    return <Card>Error</Card>
  }
  return (
    <Card>
      <Stack direction={'row'}>
        {loading ? (
          <>Now loading...</>
        ) : (
          <>
            <CardContent>
              <Typography variant="h5">{data?.spots_by_pk?.name}</Typography>
              <Typography variant="subtitle2">{subtitle}</Typography>
            </CardContent>
            {photos.length > 0 && (
              <CardMedia
                component="img"
                image={photos[0]}
                sx={{ height: '140px' }}
              />
            )}
          </>
        )}
      </Stack>
    </Card>
  )
}

export default SpotCard
