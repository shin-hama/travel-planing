import * as React from 'react'
import { useList } from 'react-use'

import { SpotDTO, SpotEvent, usePlanEvents } from 'hooks/usePlanEvents'

export const useSelectedSpots = () => {
  const [events, eventsApi] = usePlanEvents()
  const [spots, spotsActions] = useList<SpotDTO>([])

  React.useEffect(() => {
    spotsActions.set(
      events
        .filter(
          (event): event is SpotEvent =>
            event.extendedProps.type === 'spot' &&
            event.id !== 'start' &&
            event.id !== 'end'
        )
        .map((event) => ({
          placeId: event.extendedProps.placeId,
          imageUrl: event.extendedProps.imageUrl,
          name: event.title,
        })) || []
    )
  }, [events, spotsActions])

  const actions = React.useMemo(
    () => ({
      add: (newSpot: typeof spots[number]) => {
        eventsApi.push(newSpot)
      },
      get: (placeId: string) => {
        return spots.find((spot) => spot.placeId === placeId)
      },
      remove: (removedId: string) => {
        const removedEvent = eventsApi.get(removedId)
        removedEvent && eventsApi.remove(removedEvent)
      },
    }),
    [eventsApi, spots]
  )

  return [spots, actions] as const
}
