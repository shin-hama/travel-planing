import SpotEventEditor from 'components/modules/SpotEventEditor'
import * as React from 'react'
import { Spot } from './CurrentPlanProvider'

const SpotEditorContext = React.createContext<
  React.Dispatch<React.SetStateAction<Spot | null>>
>(() => {
  throw Error('SpotEditorProvider is not wrapped')
})

export const SpotEditorProvider: React.FC = ({ children }) => {
  const [spot, setSpot] = React.useState<Spot | null>(null)

  return (
    <>
      <SpotEditorContext.Provider value={setSpot}>
        {children}
      </SpotEditorContext.Provider>
      {spot && (
        <SpotEventEditor
          open={Boolean(spot)}
          onClose={() => setSpot(null)}
          spotId={spot.id}
        />
      )}
    </>
  )
}

export const useSpotEditor = () => {
  const setSpot = React.useContext(SpotEditorContext)

  const actions = React.useMemo(() => {
    const a = {
      open: (target: Spot) => setSpot(target),
      close: () => setSpot(null),
    }

    return a
  }, [setSpot])

  return actions
}
