import * as React from 'react'

export const SelectedPrefectureContext = React.createContext<number | null>(
  null
)
export const SetSelectedPrefectureContext = React.createContext<
  React.Dispatch<React.SetStateAction<number | null>>
>(() => {
  throw new Error('SelectedPrefectureProvider is not wrapped')
})

export const SelectedPrefectureProvider: React.FC = ({ children }) => {
  const [selected, setSelected] = React.useState<number | null>(null)

  return (
    <SelectedPrefectureContext.Provider value={selected}>
      <SetSelectedPrefectureContext.Provider value={setSelected}>
        {children}
      </SetSelectedPrefectureContext.Provider>
    </SelectedPrefectureContext.Provider>
  )
}
