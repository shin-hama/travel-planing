import * as React from 'react'

type PlanViewConfig = {
  lastAddDay: number
  routeMode: boolean
}

type Context = {
  config: PlanViewConfig | null
  setConfig: React.Dispatch<React.SetStateAction<PlanViewConfig>>
}
const PlanViewConfigContext = React.createContext<Context>({
  config: null,
  setConfig: () => {
    throw Error('PlanViewConfigProvider is not wrapped')
  },
})

export const PlanViewConfigProvider: React.FC = ({ children }) => {
  const [config, setConfig] = React.useState<PlanViewConfig>({
    lastAddDay: 0,
    routeMode: false,
  })
  return (
    <PlanViewConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </PlanViewConfigContext.Provider>
  )
}

export const usePlanViewConfig = () => {
  const { config, setConfig } = React.useContext(PlanViewConfigContext)

  if (config === null) {
    throw Error('PlanViewConfigProvider is not wrapped')
  }

  const setter = React.useCallback(
    (newValues: Partial<PlanViewConfig>) => {
      setConfig((prev) => ({
        ...prev,
        ...newValues,
      }))
    },
    [setConfig]
  )

  return [config, setter] as const
}
