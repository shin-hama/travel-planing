import * as React from 'react'

import { addDoc, DocumentReference } from 'firebase/firestore'

import { Schedule, SpotDTO } from './useSchedules'
import { CurrentPlanDocContext, Spot } from 'contexts/CurrentPlanProvider'
import {
  CurrentEventsContext,
  EVENTS_SUB_COLLECTIONS,
} from 'contexts/CurrentEventsProvider'

export const useEvents = (parent?: DocumentReference<Schedule>) => {
  const planDoc = React.useContext(CurrentPlanDocContext)
  const events = React.useContext(CurrentEventsContext)

  const actions = React.useMemo(() => {
    const a = {
      create: async (
        newSpot: SpotDTO & Partial<Spot>,
        schedule: DocumentReference<Schedule>
      ) => {
        if (planDoc) {
          const size = actions.filter(schedule.id).length || 0
          const spot: Spot = {
            duration: 60,
            durationUnit: 'minute',
            position: 1000 * (size + 1),
            imageUrl: '',
            ...newSpot,
            schedule,
          }
          const c = EVENTS_SUB_COLLECTIONS(planDoc)
          await addDoc(c, spot)
        }
      },
      filter: (targetId: string) => {
        if (!events) {
          console.warn('events are not found')
          return []
        }
        return events.docs
          .filter((e) => e.data().schedule.id === targetId)
          .sort((a, b) => a.data().position - b.data().position)
      },
    }

    return a
  }, [events, planDoc])

  const filtered = React.useMemo(() => {
    return parent ? actions.filter(parent.id) : events?.docs || []
  }, [actions, events?.docs, parent])

  return [filtered, actions] as const
}
