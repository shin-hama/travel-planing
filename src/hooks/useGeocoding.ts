import * as React from 'react'

export const useGeocoding = () => {
  const geo = React.useMemo(() => new window.google.maps.Geocoder(), [])

  const search = React.useCallback(() => {
    geo.geocode({ address: '北海道', region: 'JP' }, (result, status) => {
      console.log(status)
      console.log(result)
    })
  }, [geo])

  return { search }
}
