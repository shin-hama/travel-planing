import * as React from 'react'
import { useList } from 'react-use'
import { ListActions } from 'react-use/lib/useList'

export type Spot = {
  placeId: string
  photo: string
}
export const SelectedPlacesContext = React.createContext<Array<Spot>>([])
const SelectedPlacesActionsContext =
  React.createContext<ListActions<Spot> | null>(null)

export const useSelectedPlacesActions = () => {
  const actions = React.useContext(SelectedPlacesActionsContext)
  if (actions === null) {
    throw Error('SelectedPlacesProvider is not wrapped')
  }

  return actions
}

export const SelectedPlacesProvider: React.FC = ({ children }) => {
  const [places, actions] = useList<Spot>([])
  return (
    <SelectedPlacesContext.Provider value={places}>
      <SelectedPlacesActionsContext.Provider value={actions}>
        {children}
      </SelectedPlacesActionsContext.Provider>
    </SelectedPlacesContext.Provider>
  )
}
