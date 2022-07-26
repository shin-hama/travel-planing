import SpotEventEditor, {
  SpotUpdate,
} from 'components/modules/Schedule/SpotEventEditor'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import { useAuthentication } from 'hooks/firebase/useAuthentication'
import { useFirestore } from 'hooks/firebase/useFirestore'
import { useStorage } from 'hooks/firebase/useStorage'
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
  const storage = useStorage()
  const [user] = useAuthentication()

  const handleDelete = React.useCallback(() => {
    if (spot) {
      db.delete(spot.ref)
      setSpot(null)
    }
  }, [db, spot])

  const handleUpdate = React.useCallback(
    async (updated: SpotUpdate) => {
      if (user && spot) {
        const { uploaded, ...rest } = updated
        let spotUpdated: Partial<Spot> = {
          ...rest,
        }
        if (uploaded) {
          // upload file to storage
          const path = `${user.uid}/${spot.ref.parent.parent?.id}/${spot.id}/${uploaded.name}`
          const result = await storage.upload(uploaded, path)
          const url = await storage.getDownloadURL(result.ref)
          spotUpdated = {
            ...spotUpdated,
            image: {
              url,
              ref: result.ref.fullPath,
            },
          }
        }

        db.update<Spot>(spot.ref, spotUpdated)
        setSpot(null)
      }
    },
    [db, spot, storage, user]
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
