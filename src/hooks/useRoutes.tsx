import * as React from 'react'

import { Route, Time } from 'contexts/CurrentPlanProvider'
import { TravelMode, useDirections } from './googlemaps/useDirections'

export const useRoutes = () => {
  const { search, loading } = useDirections()

  const actions = React.useMemo(() => {
    const a = {
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
  }, [search])

  return { routesApi: actions, loading }
}
