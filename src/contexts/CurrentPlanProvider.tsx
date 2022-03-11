import * as React from 'react'
import { GetPrefecturesQuery } from 'generated/graphql'
import { ScheduleEvent } from './SelectedPlacesProvider'

export type Prefecture = GetPrefecturesQuery['prefectures'][number]

export type Plan = {
  id: string
  title: string
  home: Prefecture
  destination: Prefecture
  start?: Date
  end?: Date
  events?: Array<ScheduleEvent>
}

type PlanAction =
  | {
      type: 'create'
      value: Plan
    }
  | {
      type: 'update'
      value: Partial<Plan>
    }

const planReducer = (state: Plan | null, action: PlanAction): Plan | null => {
  switch (action.type) {
    case 'create':
      return action.value

    case 'update':
      if (state === null) {
        console.warn('Cannot update plan before selecting')
        return null
      }
      return { ...state, ...action.value }

    default:
      throw new Error(`Action: "${action}" is not implemented`)
  }
}

export const CurrentPlanContext = React.createContext<Plan | null>(null)
export const SetCurrentPlanContext = React.createContext<
  React.Dispatch<PlanAction>
>(() => {
  throw new Error('CurrentPlanContextProvider is not wrapped')
})

export const CurrentPlanContextProvider: React.FC = ({ children }) => {
  const [plan, setPlan] = React.useReducer(planReducer, null)

  return (
    <CurrentPlanContext.Provider value={plan}>
      <SetCurrentPlanContext.Provider value={setPlan}>
        {children}
      </SetCurrentPlanContext.Provider>
    </CurrentPlanContext.Provider>
  )
}
