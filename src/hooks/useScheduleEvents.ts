import * as React from 'react'
import { useList } from 'react-use'

import { Spot } from 'contexts/CurrentPlanProvider'
import { useTravelPlan } from './useTravelPlan'

export const useScheduleEvents = () => {
  const [plan] = useTravelPlan()
  const [events, setEvents] = useList<Spot>()
  const eventsRef = React.useRef<typeof events>([])
  eventsRef.current = events

  React.useEffect(() => {
    if (!plan) {
      return
    }
    if (plan.waypoints.length === 0) {
      console.log('no waypoints')
      setEvents.clear()
      return
    }

    setEvents.set([
      {
        ...plan.home,
        id: `${plan.home.placeId}-start`,
        duration: 30,
        durationUnit: 'minute',
      },
      ...plan.waypoints,
      {
        ...plan.home,
        id: `${plan.home.placeId}-end`,
        duration: 30,
        durationUnit: 'minute',
      },
    ])
  }, [plan, setEvents])

  const actions = React.useMemo(() => {
    const a = {
      get: (id: string) => {
        return eventsRef.current.find((event) => event.id === id)
      },
      update: (updatedSpot: Spot) => {
        setEvents.update((event) => event.id === updatedSpot.id, updatedSpot)
      },
    }

    return a
  }, [setEvents])

  return [events, actions] as const
}
