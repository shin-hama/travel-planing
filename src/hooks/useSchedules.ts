import * as React from 'react'

import { addDoc } from 'firebase/firestore'

import { DocumentBase } from './firebase/useFirestore'
import {
  CurrentPlanRefContext,
  Route,
  Spot,
} from 'contexts/CurrentPlanProvider'
import {
  CurrentSchedulesContext,
  SCHEDULES_SUB_COLLECTIONS,
} from 'contexts/CurrentSchedulesProvider'

export type SpotDTO = Pick<Spot, 'name' | 'placeId' | 'lat' | 'lng'>

export type DocActions<T> = {
  update: (updated: Partial<T>) => void
}

export type Schedule = DocumentBase & {
  start: Date
  end: Date
  size: number
  dept?: Route
  position: number
}

export type ScheduleDTO = Pick<Schedule, 'start' | 'end' | 'size' | 'position'>

export const useSchedules = () => {
  const planRef = React.useContext(CurrentPlanRefContext)
  const schedules = React.useContext(CurrentSchedulesContext)

  const actions = React.useMemo(() => {
    const a = {
      create: async (newSchedule: ScheduleDTO) => {
        if (planRef) {
          const c = SCHEDULES_SUB_COLLECTIONS(planRef)
          return await addDoc(c, newSchedule)
        }
      },
      get: (id: string) => {
        return schedules?.docs.find((s) => s.id === id)
      },
    }

    return a
  }, [planRef, schedules?.docs])

  return [schedules, actions] as const
}
