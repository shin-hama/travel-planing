import { SelectedPlacesContext } from 'contexts/SelectedPlacesProvider'
import * as React from 'react'

const RouteViewer = () => {
  const places = React.useContext(SelectedPlacesContext)

  return places.length > 0 ? (
    <>
      {places.map(place => (
        <>
          <p>{place.name}</p>
          <p> ↓</p>
        </>
      ))}
      <p> TOTAL : XXX hours</p>
    </>
  ) : (
    <></>
  )
}

export default RouteViewer
