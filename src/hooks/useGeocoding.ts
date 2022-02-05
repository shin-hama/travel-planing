import * as React from 'react'

export const useGeocoding = () => {
  const geo = React.useMemo(() => new window.google.maps.Geocoder(), [])

  const search = React.useCallback(
    async (address: string) => {
      const test = await geo.geocode(
        { address, region: 'JP' },
        (results, status) => {
          if (status === 'OK') {
            return results
          }
        }
      )
      return test.results[0]
    },
    [geo]
  )

  return { search }
}
