import * as React from 'react'
import { GetPrefecturesQuery } from 'generated/graphql'

export type Prefecture = GetPrefecturesQuery['prefectures'][number]
type SelectedPrefecture = {
  home?: Prefecture | null
  destination?: Prefecture | null
}
export const SelectedPrefectureContext =
  React.createContext<SelectedPrefecture>({})
export const SetSelectedPrefectureContext = React.createContext<
  React.Dispatch<React.SetStateAction<SelectedPrefecture>>
>(() => {
  throw new Error('SelectedPrefectureProvider is not wrapped')
})

export const SelectedPrefectureProvider: React.FC = ({ children }) => {
  const [selected, setSelected] = React.useState<SelectedPrefecture>({})

  return (
    <SelectedPrefectureContext.Provider value={selected}>
      <SetSelectedPrefectureContext.Provider value={setSelected}>
        {children}
      </SetSelectedPrefectureContext.Provider>
    </SelectedPrefectureContext.Provider>
  )
}
