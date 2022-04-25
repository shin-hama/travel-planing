import * as React from 'react'
import { useList } from 'react-use'
import { ListActions } from 'react-use/lib/useList'

import { Spot } from './CurrentPlanProvider'

export const SelectedSpotsContext = React.createContext<Array<Spot>>([])
export const SetSelectedSpotsContext =
  React.createContext<ListActions<Spot> | null>(null)

export const SelectedSpotsProvider: React.FC = ({ children }) => {
  const [selected, setSelected] = useList<Spot>()
  return (
    <SelectedSpotsContext.Provider value={selected}>
      <SetSelectedSpotsContext.Provider value={setSelected}>
        {children}
      </SetSelectedSpotsContext.Provider>
    </SelectedSpotsContext.Provider>
  )
}
