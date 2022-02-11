import * as React from 'react'

type Service = google.maps.DistanceMatrixService

export const DistanceMatrixContext = React.createContext<Service | null>(null)

export const SetDistanceMatrixContext = React.createContext<
  React.Dispatch<React.SetStateAction<Service | null>>
>(() => {
  throw Error('DistanceMatrixProvider is not wrapped')
})

export const DistanceMatrixProvider: React.FC = ({ children }) => {
  const [distanceMatrix, setDistanceMatrix] = React.useState<Service | null>(
    null
  )

  return (
    <DistanceMatrixContext.Provider value={distanceMatrix}>
      <SetDistanceMatrixContext.Provider value={setDistanceMatrix}>
        {children}
      </SetDistanceMatrixContext.Provider>
    </DistanceMatrixContext.Provider>
  )
}
