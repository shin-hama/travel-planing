import * as React from 'react'

export type PlanningTab = 'info' | 'map' | 'schedule'
const PlanningTabContext = React.createContext<PlanningTab | null>(null)
const SetPlanningTabContext = React.createContext<
  React.Dispatch<React.SetStateAction<PlanningTab>>
>(() => {
  throw Error('PlanningTabProvider is not wrapped')
})

export const PlanningTabProvider: React.FC = ({ children }) => {
  const [tab, setTab] = React.useState<PlanningTab>('map')
  return (
    <PlanningTabContext.Provider value={tab}>
      <SetPlanningTabContext.Provider value={setTab}>
        {children}
      </SetPlanningTabContext.Provider>
    </PlanningTabContext.Provider>
  )
}

export const usePlanningTab = () => {
  const tab = React.useContext(PlanningTabContext)
  const setTab = React.useContext(SetPlanningTabContext)

  if (tab === null) {
    throw Error('PlanningTab is not wrapped')
  }

  const actions = React.useMemo(() => {
    const a = {
      open: (value: PlanningTab) => setTab(value),
      openInfo: () => setTab('info'),
      openMap: () => setTab('map'),
      openSchedule: () => setTab('schedule'),
    }

    return a
  }, [setTab])

  return [tab, actions] as const
}
