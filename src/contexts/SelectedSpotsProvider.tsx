import * as React from 'react'
import { useList } from 'react-use'
import { ListActions } from 'react-use/lib/useList'

import { SpotDTO } from './CurrentPlanProvider'

export const SelectedSpotsContext = React.createContext<Array<SpotDTO>>([])
export const SetSelectedSpotsContext =
  React.createContext<ListActions<SpotDTO> | null>(null)

export const SelectedSpotsProvider: React.FC = ({ children }) => {
  const [selected, setSelected] = useList<SpotDTO>()
  return (
    <SelectedSpotsContext.Provider value={selected}>
      <SetSelectedSpotsContext.Provider value={setSelected}>
        {children}
      </SetSelectedSpotsContext.Provider>
    </SelectedSpotsContext.Provider>
  )
}
