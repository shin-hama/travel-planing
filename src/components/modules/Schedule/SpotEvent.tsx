import * as React from 'react'
import Box from '@mui/material/Box'
import { QueryDocumentSnapshot } from 'firebase/firestore'

import RouteEvent from './Route'
import SpotEventCard from './SpotEventCard'
import { Route, Spot, SpotBase } from 'contexts/CurrentPlanProvider'
import { useSpotEditor } from 'contexts/SpotEditorProvider'

type Props = {
  origin: QueryDocumentSnapshot<Spot>
  start: Date
  dest?: SpotBase | null
  handleUpdate: (updated: Partial<Spot>) => void
}
const SpotEvent: React.FC<Props> = React.memo(function SpotCard({
  origin,
  dest,
  start,
  handleUpdate,
}) {
  const { open } = useSpotEditor()

  const handleUpdateNext = React.useCallback(
    (route: Route) => {
      handleUpdate({
        next: {
          ...route,
        },
      })
    },
    [handleUpdate]
  )

  if (!origin) {
    return <>Loading</>
  }

  return (
    <>
      <Box
        onClick={() => open(origin)}
        sx={{
          border: (theme) => `solid ${theme.palette.grey[300]} 1px`,
          borderRadius: 2,
        }}>
        <SpotEventCard spot={origin.data()} start={start} />
      </Box>
      {dest && (
        <Box py={0.5}>
          <RouteEvent
            origin={origin.data()}
            dest={dest}
            onChange={handleUpdateNext}
          />
        </Box>
      )}
    </>
  )
})

export default SpotEvent
