import { Prefecture } from 'constant/prefectures'
import * as React from 'react'

export const SelectedPrefectureContext = React.createContext<Prefecture | null>(
  null
)
export const SetSelectedPrefectureContext = React.createContext<
  React.Dispatch<React.SetStateAction<Prefecture | null>>
>(() => {
  throw new Error('SelectedPrefectureProvider is not wrapped')
})

export const SelectedPrefectureProvider: React.FC = ({ children }) => {
  const [selected, setSelected] = React.useState<Prefecture | null>(null)

  return (
    <SelectedPrefectureContext.Provider value={selected}>
      <SetSelectedPrefectureContext.Provider value={setSelected}>
        {children}
      </SetSelectedPrefectureContext.Provider>
    </SelectedPrefectureContext.Provider>
  )
}
