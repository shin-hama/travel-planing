import * as React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownLong } from '@fortawesome/free-solid-svg-icons'

import { SelectedPlacesContext } from 'contexts/SelectedPlacesProvider'
import { useDirections } from 'hooks/useDirections'
import { useDistanceMatrix } from 'hooks/useDistanceMatrix'
import SpotCard from './organisms/SpotCard'

const secondsToHourMin = (sec: number): string => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)

  return `${h}時間${m}分`
}

const sum = (arr: Array<number>) => {
  return arr.reduce((prev, current, i, arr) => {
    return prev + current
  })
}

type ArrowProps = {
  text: string
}
const RouteArrow: React.FC<ArrowProps> = ({ text }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <FontAwesomeIcon icon={faDownLong} size="lg" />
      <Typography>{text}</Typography>
    </Stack>
  )
}

const RouteViewer = () => {
  const [durations, setDurations] = React.useState<
    Array<google.maps.DistanceMatrixResponseElement>
  >([])
  const places = React.useContext(SelectedPlacesContext)
  const directionService = useDirections()
  // to avoid the bug that infinite rerender and recall api after every api call
  const dirCountRef = React.useRef(0)
  const distanceMatrix = useDistanceMatrix()
  const distCountRef = React.useRef(0)

  React.useEffect(() => {
    if (dirCountRef.current !== 0) {
      // to avoid the bug that infinite rerender and recall api after every api call
      return
    }
    dirCountRef.current += 1

    // directionService.search(places).then(result => {
    //   console.log(result)
    // })
  }, [directionService, places])

  React.useEffect(() => {
    if (distCountRef.current !== 0) {
      return
    }
    distCountRef.current += 1
    // マトリックスの要素数で課金されるので、できるだけ少なくなるようにリクエストを考える
    // 例: 3地点の距離を計算するとき、3*3でリクエストすると9回分だが、
    // 1,2点目 + 2,3 点目というようにすれば 2 回分ですむ
    const func = async () => {
      const results = await Promise.all(
        places
          .filter((e, i) => i !== places.length - 1)
          .map(async (place, i) => {
            const org = [(({ placeId }) => ({ placeId }))(place)]
            const dest = [(({ placeId }) => ({ placeId }))(places[i + 1])]
            const result = await distanceMatrix.search(org, dest)

            return result.rows[0].elements[0]
          })
      )

      setDurations(results)
    }
    func()
  }, [distanceMatrix, places])

  React.useEffect(() => {
    // Reset count to make to be callable
    distCountRef.current = 0
    dirCountRef.current = 0
  }, [])

  return (
    <Container maxWidth="xs">
      {places.length > 0 && (
        <>
          {places.map((place, i) => (
            <div key={place.placeId}>
              <SpotCard placeId={place.placeId} />
              <Box sx={{ py: 2, pl: 4 }}>
                <RouteArrow
                  text={
                    i < durations.length
                      ? `${secondsToHourMin(durations[i].duration.value)}: ${
                          durations[i].distance.text
                        }`
                      : ''
                  }
                />
              </Box>
            </div>
          ))}
          <>
            {durations.length === 0 ? (
              <>Calculating route duration...</>
            ) : (
              <Typography>
                {' '}
                TOTAL :{' '}
                {secondsToHourMin(sum(durations.map(d => d.duration.value)))}
              </Typography>
            )}
          </>
        </>
      )}
    </Container>
  )
}

export default RouteViewer
