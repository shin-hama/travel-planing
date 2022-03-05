import { MapPropsContext, SetMapPropsContext } from 'contexts/MapPropsProvider'
import * as React from 'react'

export const useMapProps = () => {
  const mapProps = React.useContext(MapPropsContext)
  const setMapProps = React.useContext(SetMapPropsContext)

  if (mapProps === null) {
    throw new Error('MapPropsProvider is not wrapped')
  }

  return [mapProps, setMapProps] as const
}
