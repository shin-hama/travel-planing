import * as React from 'react'

import {
  CurrentPlanActionsContext,
  CurrentPlanContext,
} from 'contexts/CurrentPlanProvider'

export const usePlan = () => {
  const plan = React.useContext(CurrentPlanContext)
  const actions = React.useContext(CurrentPlanActionsContext)
  if (actions === null) {
    throw Error('PlanContext is not wrapped')
  }

  return [plan, actions] as const
}
