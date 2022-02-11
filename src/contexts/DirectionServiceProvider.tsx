import * as React from 'react'

type Service = google.maps.DirectionsService

export const DirectionServiceContext = React.createContext<Service | null>(null)

export const SetDirectionServiceContext = React.createContext<
  React.Dispatch<React.SetStateAction<Service | null>>
>(() => {
  throw Error('DistanceMatrixProvider is not wrapped')
})

export const DirectionServiceProvider: React.FC = ({ children }) => {
  const [distanceMatrix, setDistanceMatrix] = React.useState<Service | null>(
    null
  )
  return (
    <DirectionServiceContext.Provider value={distanceMatrix}>
      <SetDirectionServiceContext.Provider value={setDistanceMatrix}>
        {children}
      </SetDirectionServiceContext.Provider>
    </DirectionServiceContext.Provider>
  )
}
