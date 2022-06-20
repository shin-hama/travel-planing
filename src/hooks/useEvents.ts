import * as React from 'react'

import { addDoc, DocumentReference } from 'firebase/firestore'

import { Schedule, SpotDTO } from './useSchedules'
import { CurrentPlanRefContext, Spot } from 'contexts/CurrentPlanProvider'
import {
  CurrentEventsContext,
  EVENTS_SUB_COLLECTIONS,
} from 'contexts/CurrentEventsProvider'

export const useEvents = (schedule?: DocumentReference<Schedule>) => {
  const planRef = React.useContext(CurrentPlanRefContext)
  const events = React.useContext(CurrentEventsContext)

  const filtered = React.useMemo(() => {
    console.log(schedule)
    console.log(events?.docs.map((doc) => doc.get('schedule')))
    return (
      events?.docs.filter(
        (doc) => !schedule || doc.data().schedule.id === schedule.id
      ) || []
    )
  }, [events?.docs, schedule])

  const actions = React.useMemo(() => {
    const a = {
      create: async (
        newSpot: SpotDTO & Partial<Spot>,
        schedule: DocumentReference<Schedule>
      ) => {
        if (planRef) {
          const size = filtered.length || 0
          const spot: Spot = {
            duration: 60,
            durationUnit: 'minute',
            position: 1000 * (size + 1),
            imageUrl: '',
            ...newSpot,
            schedule,
            id: '',
          }
          const c = EVENTS_SUB_COLLECTIONS(planRef)
          await addDoc(c, spot)
        }
      },
    }

    return a
  }, [filtered.length, planRef])

  return [filtered, actions] as const
}
