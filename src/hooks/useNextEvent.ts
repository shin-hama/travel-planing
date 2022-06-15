import * as React from 'react'

import { DocumentReference } from 'firebase/firestore'
import { SpotDocument } from './useEvents'
import { useDocument } from './firebase/useDocument'

export const useNextEvent = (eventRef: DocumentReference<SpotDocument>) => {
  const [event, actions] = useDocument(eventRef)
  const next = React.useMemo(() => event?.next || null, [event])
}
