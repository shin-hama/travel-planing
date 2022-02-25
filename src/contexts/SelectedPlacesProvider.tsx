import * as React from 'react'
import { useMap } from 'react-use'
import { StableActions } from 'react-use/lib/useMap'
import { EventInput } from '@fullcalendar/react' // must go before plugins

export type Spot = { placeId?: string; imageUrl?: string }
export type SpotEvent =
  | EventInput & {
      id: string
      start: Date
      end: Date
      extendedProps?: Spot
    }
export const SelectedPlacesContext = React.createContext<
  Record<string, SpotEvent>
>({})
const SelectedPlacesActionsContext = React.createContext<StableActions<
  Record<string, SpotEvent>
> | null>(null)

export const useSelectedPlacesActions = () => {
  const actions = React.useContext(SelectedPlacesActionsContext)
  if (actions === null) {
    throw Error('SelectedPlacesProvider is not wrapped')
  }

  return actions
}

export const SelectedPlacesProvider: React.FC = ({ children }) => {
  const [places, actions] = useMap<Record<string, SpotEvent>>()
  return (
    <SelectedPlacesContext.Provider value={places}>
      <SelectedPlacesActionsContext.Provider value={actions}>
        {children}
      </SelectedPlacesActionsContext.Provider>
    </SelectedPlacesContext.Provider>
  )
}
