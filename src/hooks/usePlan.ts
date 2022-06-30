import * as React from 'react'

import {
  CurrentPlanActionsContext,
  CurrentPlanContext,
  CurrentPlanDocContext,
} from 'contexts/CurrentPlanProvider'

export const usePlan = () => {
  const planData = React.useContext(CurrentPlanContext)
  const planDoc = React.useContext(CurrentPlanDocContext)
  const actions = React.useContext(CurrentPlanActionsContext)
  if (actions === null) {
    throw Error('PlanContext is not wrapped')
  }

  const plan = React.useMemo(
    () => ({
      data: planData,
      doc: planDoc,
    }),
    [planData, planDoc]
  )

  return [plan, actions] as const
}
