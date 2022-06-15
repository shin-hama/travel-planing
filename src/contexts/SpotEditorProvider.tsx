import SpotEventEditor from 'components/modules/Schedule/SpotEventEditor'
import * as React from 'react'
import { Spot } from './CurrentPlanProvider'

type SpotEditor = {
  spot: Spot
  update: (updated: Spot) => void
  delete: () => void
}

const SpotEditorContext = React.createContext<
  React.Dispatch<React.SetStateAction<SpotEditor | null>>
>(() => {
  throw Error('SpotEditorProvider is not wrapped')
})

export const SpotEditorProvider: React.FC = ({ children }) => {
  const [spot, setSpot] = React.useState<SpotEditor | null>(null)

  const handleDelete = React.useCallback(() => {
    spot?.delete()
    setSpot(null)
  }, [spot])

  const handleUpdate = React.useCallback(
    (updated: Spot) => {
      spot?.update(updated)
      setSpot(null)
    },
    [spot]
  )
  return (
    <>
      <SpotEditorContext.Provider value={setSpot}>
        {children}
      </SpotEditorContext.Provider>
      {spot && (
        <SpotEventEditor
          open={Boolean(spot)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          spot={spot.spot}
        />
      )}
    </>
  )
}

export const useSpotEditor = () => {
  const setSpot = React.useContext(SpotEditorContext)

  const actions = React.useMemo(() => {
    const a = {
      open: (target: SpotEditor) => setSpot(target),
    }

    return a
  }, [setSpot])

  return actions
}
