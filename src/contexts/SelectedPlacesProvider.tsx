import * as React from 'react'
import { useList } from 'react-use'
import { ListActions } from 'react-use/lib/useList'
import { EventInput } from '@fullcalendar/react' // must go before plugins

export type Spot = { placeId?: string; imageUrl?: string }
export type SpotEvent =
  | EventInput & {
      id: string
      start: Date
      end: Date
      extendedProps?: Spot
    }
export const SelectedPlacesContext = React.createContext<Array<SpotEvent>>([])
const SelectedPlacesActionsContext =
  React.createContext<ListActions<SpotEvent> | null>(null)

export const useSelectedPlacesActions = () => {
  const actions = React.useContext(SelectedPlacesActionsContext)
  if (actions === null) {
    throw Error('SelectedPlacesProvider is not wrapped')
  }

  return actions
}

export const SelectedPlacesProvider: React.FC = ({ children }) => {
  const [places, actions] = useList<SpotEvent>()
  return (
    <SelectedPlacesContext.Provider value={places}>
      <SelectedPlacesActionsContext.Provider value={actions}>
        {children}
      </SelectedPlacesActionsContext.Provider>
    </SelectedPlacesContext.Provider>
  )
}
