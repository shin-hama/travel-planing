import * as React from 'react'

import {
  PlanViewConfig,
  PlanViewConfigContext,
} from 'contexts/PlanViewConfigProvider'

export const usePlanViewConfig = () => {
  const { config, setConfig } = React.useContext(PlanViewConfigContext)
  const ref = React.useRef<PlanViewConfig | null>(null)
  ref.current = config

  if (config === null) {
    throw Error('PlanViewConfigProvider is not wrapped')
  }

  const actions = React.useMemo(() => {
    const a = {
      set: (key: keyof typeof config, value: PlanViewConfig[typeof key]) => {
        setConfig((prev) => ({
          ...prev,
          [key]: value as PlanViewConfig[typeof key],
        }))
      },
      get: (key: keyof typeof config) => ref.current?.[key],
    }

    return a
  }, [setConfig])

  return actions
}
