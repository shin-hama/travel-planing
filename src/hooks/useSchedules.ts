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
import dayjs from 'dayjs'

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
      create: async () => {
        if (planRef) {
          const startDate = dayjs().hour(9).minute(0).second(0)
          const totalPos = (schedules?.docs || []).reduce(
            (pos, schedule) => pos + schedule.data().position,
            1024
          )

          const newSchedule: ScheduleDTO = {
            start: startDate.toDate(),
            end: startDate.hour(19).minute(0).toDate(),
            size: 0,
            position: totalPos,
          }
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
