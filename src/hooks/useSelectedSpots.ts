import * as React from 'react'

import { ScheduleEvent, SpotEvent } from 'contexts/ScheduleEventsProvider'
import {
  SelectedSpotsContext,
  SetSelectedSpotsContext,
} from 'contexts/SelectedSpotsProvider'
import { usePlan } from './usePlan'

export const useSelectedSpots = () => {
  const spots = React.useContext(SelectedSpotsContext)
  const spotsActions = React.useContext(SetSelectedSpotsContext)
  if (spotsActions === null) {
    throw Error('SelectedSpotsProvider is not wrapped')
  }
  const [currentPlan] = usePlan()

  const init = React.useCallback(
    (events: Array<ScheduleEvent>) => {
      spotsActions.set(
        events
          .filter(
            (event): event is SpotEvent =>
              event.extendedProps.type === 'spot' &&
              event.extendedProps.placeId !== currentPlan?.home?.placeId
          )
          .map((event) => ({
            placeId: event.extendedProps.placeId,
            imageUrl: event.extendedProps.imageUrl,
          }))
      )
    },
    [currentPlan?.home?.placeId, spotsActions]
  )

  const add = React.useCallback(
    (newSpot: typeof spots[number]) => {
      spotsActions.push(newSpot)
    },
    [spotsActions]
  )

  const remove = React.useCallback(
    (removedId: string) => {
      spotsActions.filter((spot) => spot.placeId !== removedId)
    },
    [spotsActions]
  )

  const get = React.useCallback(
    (placeId: string) => {
      return spots.find((spot) => spot.placeId === placeId)
    },
    [spots]
  )

  const actions = React.useMemo(
    () => ({ add, get, init, remove }),
    [add, get, init, remove]
  )

  return [spots, actions] as const
}
