import * as React from 'react'

export type PlanViewConfig = {
  lastAddDay: number
}

type Context = {
  config: PlanViewConfig | null
  setConfig: React.Dispatch<React.SetStateAction<PlanViewConfig>>
}
export const PlanViewConfigContext = React.createContext<Context>({
  config: null,
  setConfig: () => {
    throw Error('PlanViewConfigProvider is not wrapped')
  },
})

export const PlanViewConfigProvider: React.FC = ({ children }) => {
  const [config, setConfig] = React.useState<PlanViewConfig>({
    lastAddDay: 0,
  })
  return (
    <PlanViewConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </PlanViewConfigContext.Provider>
  )
}
