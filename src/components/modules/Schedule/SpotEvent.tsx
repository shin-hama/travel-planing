import * as React from 'react'
import Box from '@mui/material/Box'

import RouteEvent from './Route'
import SpotEventCard from './SpotEventCard'
import { DocumentReference } from 'firebase/firestore'
import { useDocument } from 'hooks/firebase/useDocument'
import { Route, Spot, SpotBase } from 'contexts/CurrentPlanProvider'

type Props = {
  originRef: DocumentReference<Spot>
  start: Date
  dest?: SpotBase | null
}
const SpotEvent: React.FC<Props> = ({ originRef, dest, start }) => {
  const [origin, actions] = useDocument(originRef)

  const handleUpdateNext = React.useCallback(
    (route: Route) => {
      if (dest) {
        actions.update({
          next: {
            ...route,
          },
        })
      }
    },
    [actions, dest]
  )

  if (!origin) {
    return <>Loading</>
  }

  return (
    <>
      <SpotEventCard event={originRef} start={start} />
      {dest && (
        <Box py={0.5}>
          <RouteEvent origin={origin} dest={dest} onChange={handleUpdateNext} />
        </Box>
      )}
    </>
  )
}

export default SpotEvent
