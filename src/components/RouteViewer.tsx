import * as React from 'react'
import Typography from '@mui/material/Typography'

import { SelectedPlacesContext } from 'contexts/SelectedPlacesProvider'
import { useDirections } from 'hooks/useDirections'
import { useDistanceMatrix } from 'hooks/useDistanceMatrix'

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

const RouteViewer = () => {
  const [durations, setDurations] = React.useState<Array<number>>([])
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

    distanceMatrix.search(places).then(result => {
      console.log(result)
      setDurations(
        result.rows
          .filter((row, index) => index !== result.rows.length - 2)
          .map((row, index) => {
            const durationSec =
              row.elements[index].duration.value +
              row.elements[index + 1].duration.value
            return durationSec
          })
      )
    })
  }, [distanceMatrix, places])

  React.useEffect(() => {
    // Reset count to make to be callable
    distCountRef.current = 0
    dirCountRef.current = 0
  }, [])

  return (
    <>
      {places.length > 0 && (
        <>
          <>
            {places.map((place, i) => (
              <div key={place.name}>
                <Typography>{place.name}</Typography>
                <Typography>
                  {' '}
                  ↓ {i < durations.length && secondsToHourMin(durations[i])}
                </Typography>
              </div>
            ))}
          </>
          <>
            {durations.length === 0 ? (
              <>Calculating route duration...</>
            ) : (
              <Typography>
                {' '}
                TOTAL : {secondsToHourMin(sum(durations))}
              </Typography>
            )}
          </>
        </>
      )}
    </>
  )
}

export default RouteViewer
