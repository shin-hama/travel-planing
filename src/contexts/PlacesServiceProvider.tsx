import * as React from 'react'

type Service = google.maps.places.PlacesService

export const PlacesServiceContext = React.createContext<Service | null>(null)

export const SetPlacesServiceContext = React.createContext<
  React.Dispatch<React.SetStateAction<Service | null>>
>(() => {
  throw Error('PlacesServiceProvider is not wrapped')
})

export const PlacesServiceProvider: React.FC = ({ children }) => {
  const [places, setPlaces] = React.useState<Service | null>(null)
  return (
    <PlacesServiceContext.Provider value={places}>
      <SetPlacesServiceContext.Provider value={setPlaces}>
        {children}
      </SetPlacesServiceContext.Provider>
    </PlacesServiceContext.Provider>
  )
}
