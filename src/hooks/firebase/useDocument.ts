import * as React from 'react'

import {
  DocumentReference,
  FirestoreDataConverter,
  onSnapshot,
  UpdateData,
  updateDoc,
} from 'firebase/firestore'

export type DocActions<T> = {
  update: (updated: UpdateData<T>) => void
}

export const useDocument = <T>(
  ref: DocumentReference<T> | null,
  converter: FirestoreDataConverter<T>
) => {
  const [document, setDocument] = React.useState<T | null>(null)

  React.useEffect(() => {
    if (!ref) {
      return
    }
    const unsubscribe = onSnapshot(ref.withConverter(converter), (doc) => {
      setDocument(doc.data() || null)
    })

    return () => {
      unsubscribe()
    }
  }, [converter, ref])

  const actions = React.useMemo<DocActions<T>>(() => {
    const a: DocActions<T> = {
      update: async (updated) => {
        if (ref) {
          updateDoc(ref, updated)
        }
      },
    }

    return a
  }, [ref])

  return [document, actions] as const
}
