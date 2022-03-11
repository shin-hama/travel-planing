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

export const CurrentPlanContext = React.createContext<Plan | null>(null)
export const SetCurrentPlanContext = React.createContext<
  React.Dispatch<React.SetStateAction<Plan | null>>
>(() => {
  throw new Error('CurrentPlanContextProvider is not wrapped')
})

export const CurrentPlanContextProvider: React.FC = ({ children }) => {
  const [plan, setPlan] = React.useState<Plan | null>(null)

  return (
    <CurrentPlanContext.Provider value={plan}>
      <SetCurrentPlanContext.Provider value={setPlan}>
        {children}
      </SetCurrentPlanContext.Provider>
    </CurrentPlanContext.Provider>
  )
}
