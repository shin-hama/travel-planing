import * as React from 'react'

import {
  deleteDoc,
  DocumentReference,
  onSnapshot,
  UpdateData,
  updateDoc,
} from 'firebase/firestore'

export type DocActions<T> = {
  update: (updated: UpdateData<T>) => Promise<void>
  delete: () => Promise<void>
}

export const useDocument = <T>(ref: DocumentReference<T> | null) => {
  const [document, setDocument] = React.useState<T | null>(null)

  React.useEffect(() => {
    if (!ref) {
      return
    }

    const unsubscribe = onSnapshot(ref, (doc) => {
      setDocument(doc.data() || null)
    })

    return () => {
      unsubscribe()
    }
  }, [ref])

  const actions = React.useMemo<DocActions<T>>(() => {
    const a: DocActions<T> = {
      update: async (updated) => {
        if (ref) {
          updateDoc(ref, updated)
        }
      },
      delete: async () => {
        if (ref) {
          await deleteDoc(ref)
        }
      },
    }

    return a
  }, [ref])

  return [document, actions] as const
}
