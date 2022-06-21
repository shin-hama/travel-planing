import SpotEventEditor from 'components/modules/Schedule/SpotEventEditor'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import { useFirestore } from 'hooks/firebase/useFirestore'
import * as React from 'react'
import { Spot } from './CurrentPlanProvider'

const SpotEditorContext = React.createContext<
  React.Dispatch<React.SetStateAction<QueryDocumentSnapshot<Spot> | null>>
>(() => {
  throw Error('SpotEditorProvider is not wrapped')
})

export const SpotEditorProvider: React.FC = ({ children }) => {
  const [spot, setSpot] = React.useState<QueryDocumentSnapshot<Spot> | null>(
    null
  )
  const db = useFirestore()

  const handleDelete = React.useCallback(() => {
    if (spot) {
      db.delete(spot.ref)
      setSpot(null)
    }
  }, [db, spot])

  const handleUpdate = React.useCallback(
    (updated: Spot) => {
      if (spot) {
        db.update(spot.ref, updated)
        setSpot(null)
      }
    },
    [db, spot]
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
          spot={spot.data()}
        />
      )}
    </>
  )
}

export const useSpotEditor = () => {
  const setSpot = React.useContext(SpotEditorContext)

  const actions = React.useMemo(() => {
    const a = {
      open: (target: QueryDocumentSnapshot<Spot>) => setSpot(target),
    }

    return a
  }, [setSpot])

  return actions
}
