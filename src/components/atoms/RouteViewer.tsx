import { DistanceMatrixContext } from 'contexts/DistanceMatrixProvider'
import { SelectedPlacesContext } from 'contexts/SelectedPlacesProvider'
import * as React from 'react'

const RouteViewer = () => {
  const places = React.useContext(SelectedPlacesContext)
  const distanceMatrix = React.useContext(DistanceMatrixContext)

  const handleCalcRoute = async () => {
    if (distanceMatrix === null) {
      return
    }
    // const origins = [{ placeId: places[0].placeId }]
    const destinations = places.map(place => ({
      placeId: place.placeId,
    }))
    const result = await distanceMatrix.getDistanceMatrix({
      origins: destinations,
      destinations,
      travelMode: google.maps.TravelMode.DRIVING,
    })

    console.log(result)
  }

  return places.length > 0 ? (
    <>
      {places.map(place => (
        <>
          <p>{place.name}</p>
          <p> ↓</p>
        </>
      ))}
      <button onClick={handleCalcRoute}> calc route</button>
      <p> TOTAL : XXX hours</p>
    </>
  ) : (
    <></>
  )
}

export default RouteViewer
