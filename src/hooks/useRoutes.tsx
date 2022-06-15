import * as React from 'react'

import { Plan, Route, isSameRoute, Time } from 'contexts/CurrentPlanProvider'
import { usePlan } from './usePlan'
import { TravelMode, useDirections } from './googlemaps/useDirections'

export const useRoutes = () => {
  const [plan, planApi] = usePlan()
  const planRef = React.useRef<Plan | null>(null)
  planRef.current = plan

  const { search, loading } = useDirections()

  const actions = React.useMemo(() => {
    const a = {
      add: (...newRoutes: Array<Route>) => {
        if (planRef.current) {
          planApi.update({
            routes: [
              ...planRef.current.routes.filter(
                // 同条件のルートオブジェクトがあれば上書きする
                (route) =>
                  newRoutes.some(
                    (newRoute) => isSameRoute(route, newRoute) === false
                  )
              ),
              ...newRoutes,
            ],
          })
        } else {
          console.error('fail to update routes')
        }
      },
      remove: (removed: Route) => {
        if (planRef.current) {
          planApi.update({
            routes: planRef.current.routes.filter(
              (route) => isSameRoute(route, removed) === false
            ),
          })
        } else {
          console.error('fail to update routes')
        }
      },
      get: (conditions: Pick<Route, 'from' | 'to' | 'mode'>) => {
        if (!planRef.current) {
          console.error('plan is not selected')
          return null
        }

        // 同条件の Route オブジェクトを取得する
        return (
          planRef.current.routes.find((route) =>
            isSameRoute(route, conditions)
          ) || null
        )
      },
      search: async <T extends google.maps.LatLngLiteral>(
        origin: T,
        destination: T,
        mode: TravelMode
      ): Promise<Route> => {
        const time = await actions.searchRoute(origin, destination, mode)

        const newRoute: Route = {
          from: { lat: origin.lat, lng: origin.lng },
          to: { lat: destination.lat, lng: destination.lng },
          mode,
          time,
        }
        console.log(newRoute)
        return newRoute
      },
      searchRoute: async <T extends google.maps.LatLngLiteral>(
        origin: T,
        destination: T,
        mode: TravelMode
      ): Promise<Time> => {
        return await search({
          origin,
          destination,
          mode,
        })
          .then((result) => {
            console.log('Calc route')
            if (!result) {
              throw Error()
            }

            return {
              text: result.legs[0].duration.text,
              value: result.legs[0].duration.value,
              unit: 'second',
            } as Time
          })
          .catch(() => {
            return {
              text: 'Not Found',
              value: 0,
              unit: 'second',
            } as Time
          })
      },
    }

    return a
  }, [planApi, search])

  return { routesApi: actions, loading }
}
