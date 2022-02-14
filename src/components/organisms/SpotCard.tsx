import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useGetSpotByPkLazyQuery } from 'generated/graphql'

type Props = {
  placeId: string
}
const SpotCard: React.FC<Props> = ({ placeId }) => {
  const [getSpot, { data, loading, error }] = useGetSpotByPkLazyQuery()
  const [subtitle, setSubtitle] = React.useState('')

  React.useEffect(() => {
    const func = async () => {
      const result = await getSpot({ variables: { place_id: placeId } })
      console.log(result)

      const types = result.data?.spots_by_pk?.spots_types
        .map(types => {
          return types.type.category_types.map(cate => cate.category.name)
        })
        .flat()
      console.log(types)
      setSubtitle([...new Set(types)].join(', '))
    }
    func()
  }, [getSpot, placeId])

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
            {false && <CardMedia></CardMedia>}
          </>
        )}
      </Stack>
    </Card>
  )
}

export default SpotCard
