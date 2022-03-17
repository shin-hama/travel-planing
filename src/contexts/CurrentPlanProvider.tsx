import * as React from 'react'
import { ScheduleEvent } from 'hooks/usePlanEvents'

export type Prefecture = {
  name: string
  name_en: string
  lat: number
  lng: number
  zoom: number
  placeId: string
  imageUrl: string
}

export type Plan = {
  id: string
  title: string
  home: Prefecture
  destination: Prefecture
  thumbnail: string
  start: Date
  end: Date
  events?: Array<ScheduleEvent>
}

type PlanAction =
  | {
      type: 'set'
      value: Plan
    }
  | {
      type: 'update'
      value: Partial<Plan>
    }

const planReducer = (state: Plan | null, action: PlanAction): Plan | null => {
  switch (action.type) {
    case 'set':
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
