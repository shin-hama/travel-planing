import * as React from 'react'
import { useList } from 'react-use'
import { ListActions } from 'react-use/lib/useList'
import { EventInput } from '@fullcalendar/react' // must go before plugins

export type Spot = {
  type: 'spot'
  placeId: string
  imageUrl: string
  from: string | null
  to: string | null
}
export type Move = {
  type: 'move'
  from: string
  to: string
  mode: 'bicycle' | 'car' | 'walk'
}
type CustomEventInput = Omit<EventInput, 'extendedProps'>
export type SpotEvent = CustomEventInput & {
  id: string
  start: Date | string
  end: Date | string
  extendedProps: Spot
}
export type MoveEvent = CustomEventInput & {
  id: string
  start: Date | string
  end: Date | string
  extendedProps: Move
}

export type ScheduleEvent = SpotEvent | MoveEvent
export const SelectedPlacesContext = React.createContext<Array<ScheduleEvent>>(
  []
)
const SelectedPlacesActionsContext =
  React.createContext<ListActions<ScheduleEvent> | null>(null)

export const useSelectedPlacesActions = () => {
  const actions = React.useContext(SelectedPlacesActionsContext)
  if (actions === null) {
    throw Error('SelectedPlacesProvider is not wrapped')
  }

  return actions
}

export const SelectedPlacesProvider: React.FC = ({ children }) => {
  const [places, actions] = useList<ScheduleEvent>()
  return (
    <SelectedPlacesContext.Provider value={places}>
      <SelectedPlacesActionsContext.Provider value={actions}>
        {children}
      </SelectedPlacesActionsContext.Provider>
    </SelectedPlacesContext.Provider>
  )
}
