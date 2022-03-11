import * as React from 'react'
import { EventInput } from '@fullcalendar/react' // must go before plugins
import { LinkedEventsActions, useLinkedEvents } from 'hooks/useLinkedEventList'

export type SpotDTO = Required<Pick<Spot, 'placeId' | 'imageUrl'>>
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
export type EventBase = CustomEventInput & {
  id: string
  start: Date | string
  end: Date | string
}
export type SpotEvent = EventBase & {
  extendedProps: Spot
}
export type MoveEvent = EventBase & {
  extendedProps: Move
}

export type ScheduleEvent = SpotEvent | MoveEvent
export const ScheduleEventsContext = React.createContext<Array<ScheduleEvent>>(
  []
)
const ScheduleEventsActionsContext =
  React.createContext<LinkedEventsActions<ScheduleEvent> | null>(null)

export const useScheduleEventsActions = () => {
  const actions = React.useContext(ScheduleEventsActionsContext)
  if (actions === null) {
    throw Error('ScheduleEventsProvider is not wrapped')
  }

  return actions
}

export const ScheduleEventsProvider: React.FC = ({ children }) => {
  const [events, actions] = useLinkedEvents<ScheduleEvent>()
  return (
    <ScheduleEventsContext.Provider value={events}>
      <ScheduleEventsActionsContext.Provider value={actions}>
        {children}
      </ScheduleEventsActionsContext.Provider>
    </ScheduleEventsContext.Provider>
  )
}
