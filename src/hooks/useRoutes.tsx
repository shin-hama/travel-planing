import * as React from 'react'

import {
  Plan,
  Route,
  isSameRoute,
  SpotBase,
  RouteGuidanceAvailable,
} from 'contexts/CurrentPlanProvider'
import { useTravelPlan } from './useTravelPlan'
import { TravelMode, useDirections } from './googlemaps/useDirections'

export const useRoutes = () => {
  const [plan, planApi] = useTravelPlan()
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
      /**
       * ルートキャッシュから、スケジュールに含まれていないスポットのルート情報を削除する
       */
      clean: () => {
        if (planRef.current) {
          const { events, routes } = planRef.current
          const waypoints = events
            .map((e): Array<SpotBase> => e.spots)
            .flat()
            .concat(
              [planRef.current.home, planRef.current.lodging].filter(
                (spot): spot is SpotBase => spot !== undefined
              )
            )

          planApi.update({
            routes: routes.filter(
              (route) =>
                waypoints.find((point) => point.id === route.from) &&
                waypoints.find((point) => point.id === route.to)
            ),
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
      searchRoute: (
        origin: RouteGuidanceAvailable,
        destination: RouteGuidanceAvailable,
        mode: TravelMode
      ) => {
        search({
          origin,
          destination,
          mode,
        })
          .then((result) => {
            console.log('Calc route')
            if (!result) {
              throw Error()
            }

            actions.add({
              from: origin.id,
              to: destination.id,
              mode: mode,
              time: {
                text: result.legs[0].duration.text,
                value: result.legs[0].duration.value,
                unit: 'second',
              },
            })
          })
          .catch(() => {
            actions.add({
              from: origin.id,
              to: destination.id,
              mode: mode,
              time: {
                text: 'Not Found',
                value: 0,
                unit: 'second',
              },
            })
          })
      },
    }

    return a
  }, [planApi, search])

  return { routesApi: actions, loading }
}
