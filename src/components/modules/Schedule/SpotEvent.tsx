import * as React from 'react'
import Box from '@mui/material/Box'

import RouteEvent from './Route'
import SpotEventCard from './SpotEventCard'
import { useDocument } from 'hooks/firebase/useDocument'
import { Route, Spot, SpotBase } from 'contexts/CurrentPlanProvider'
import { useSpotEditor } from 'contexts/SpotEditorProvider'

type Props = {
  origin: Spot
  start: Date
  dest?: SpotBase | null
}
const SpotEvent: React.FC<Props> = React.memo(function SpotCard({
  origin,
  dest,
  start,
}) {
  const { open } = useSpotEditor()

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
    [dest]
  )

  if (!origin) {
    return <>Loading</>
  }

  return (
    <>
      <Box
        onClick={() => open({ spot: origin })}
        sx={{
          border: (theme) => `solid ${theme.palette.grey[300]} 1px`,
          borderRadius: 2,
        }}>
        <SpotEventCard spot={origin} start={start} />
      </Box>
      {dest && (
        <Box py={0.5}>
          <RouteEvent origin={origin} dest={dest} onChange={handleUpdateNext} />
        </Box>
      )}
    </>
  )
})

export default SpotEvent
