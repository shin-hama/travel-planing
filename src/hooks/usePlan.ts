import * as React from 'react'

import { ScheduleEvent } from 'contexts/SelectedPlacesProvider'
import { useFirestore } from './firebase/useFirestore'
import { useAuthentication } from './firebase/useAuthentication'
import { Prefecture } from 'contexts/SelectedPrefectureProvider'

type Plan = {
  title: string
  home: Prefecture
  destination: Prefecture
  start?: Date
  end?: Date
  events?: Array<ScheduleEvent>
}

export const usePlan = () => {
  const [user] = useAuthentication()
  const db = useFirestore()

  const savePlan = React.useCallback(
    async (newPlan: Plan) => {
      if (!user) {
        console.log('Current user is guest')
        return
      }
      const path = `planing/v1/users/${user.uid}/plans/`
      db.add(path, newPlan)
    },
    [db, user]
  )

  return { savePlan }
}
