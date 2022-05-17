import * as React from 'react'
import MapOverlay from 'components/modules/MapOverlay'
import MapSelectorLayer from 'components/modules/MapSelectorLayer'

export type LayerMode = 'normal' | 'selector'
const MapLayerModeContext = React.createContext<LayerMode | null>(null)
const SetMapLayerModeContext = React.createContext<
  React.Dispatch<React.SetStateAction<LayerMode>>
>(() => {
  throw new Error('MapLayerProvider is not wrapped')
})

export const MapLayerProvider: React.FC = ({ children }) => {
  const [mode, setMode] = React.useState<LayerMode>('normal')
  return (
    <MapLayerModeContext.Provider value={mode}>
      <SetMapLayerModeContext.Provider value={setMode}>
        {children}
      </SetMapLayerModeContext.Provider>
    </MapLayerModeContext.Provider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layers: Record<LayerMode, React.FC<any>> = {
  normal: MapOverlay,
  selector: MapSelectorLayer,
}

export const useMapLayer = () => {
  const mode = React.useContext(MapLayerModeContext)
  const setMode = React.useContext(SetMapLayerModeContext)

  if (!mode) {
    throw Error('MapLayerProvider is not wrapped')
  }

  return [Layers[mode], setMode] as const
}
