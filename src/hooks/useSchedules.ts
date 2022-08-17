import * as React from 'react'

import { addDoc, DocumentReference } from 'firebase/firestore'

import { DocumentBase } from './firebase/useFirestore'
import { Plan, Route, Spot } from 'contexts/CurrentPlanProvider'
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
  const schedules = React.useContext(CurrentSchedulesContext)

  const actions = React.useMemo(() => {
    const a = {
      /**
       * 指定した Plan にスケジュール Document を追加する
       * 連続で追加する場合は引数で指定する
       * @param planDoc スケジュールを追加する対象の Plan ドキュメント
       * @param number 作成する数、外から連続で作ろうとするとSchedulesのRefが最新にならないため
       * @returns
       */
      create: async (planDoc: DocumentReference<Plan>, number = 1) => {
        return Promise.all(
          Array.from(Array(number)).map(async (_, i) => {
            const startDate = dayjs().hour(9).minute(0).second(0)
            // 末尾に追加するため末尾の schedule.position に加算
            const newPos =
              (schedules?.docs.slice(-1)[0].data().position || 0) +
              1024 * (i + 1)

            const newSchedule: ScheduleDTO = {
              start: startDate.toDate(),
              end: startDate.hour(19).minute(0).toDate(),
              size: 0,
              position: newPos,
            }

            const c = SCHEDULES_SUB_COLLECTIONS(planDoc)
            return await addDoc(c, newSchedule)
          })
        )
      },
      get: (id: string) => {
        return schedules?.docs.find((s) => s.id === id)
      },
    }

    return a
  }, [schedules?.docs])

  return [schedules, actions] as const
}
