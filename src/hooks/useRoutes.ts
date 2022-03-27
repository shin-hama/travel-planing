import * as React from 'react'

import {
  CurrentPlanContext,
  Plan,
  Route,
  SetCurrentPlanContext,
} from 'contexts/CurrentPlanProvider'

export const useRoutes = () => {
  const plan = React.useContext(CurrentPlanContext)
  const setPlan = React.useContext(SetCurrentPlanContext)

  const planRef = React.useRef<Plan | null>(null)
  planRef.current = plan?.data || null

  const actions = React.useMemo(() => {
    const a = {
      updateRoute: (newRoute: Route) => {
        const newRoutes = planRef.current?.routes.map((route) =>
          route.from === newRoute.from && route.to === newRoute.to
            ? newRoute
            : route
        )
        setPlan({
          type: 'update',
          value: {
            routes: newRoutes,
          },
        })
      },
    }

    return a
  }, [setPlan])

  return [plan?.data.routes || null, actions] as const
}
