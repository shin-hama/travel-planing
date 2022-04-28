import * as React from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'

import Scheduler from 'components/modules/Scheduler'
import SchedulerHeader from 'components/modules/SchedulerHeader'
import { useRouter } from 'hooks/useRouter'
import { useTravelPlan } from 'hooks/useTravelPlan'

type Props = {
  onClose: () => void
}
const ScheduleView: React.FC<Props> = ({ onClose }) => {
  const router = useRouter()
  const [plan, planApi] = useTravelPlan()

  React.useEffect(() => {
    if (!plan) {
      router.userHome(true)
    }
  }, [plan, router])

  const handleUpdate = React.useCallback(
    (title: string) => {
      planApi.update({ title })
    },
    [planApi]
  )

  const handleAddHotel = React.useCallback(() => {
    onClose()
  }, [onClose])

  if (!plan) {
    return <></>
  }

  return (
    <>
      <Stack height="100%" sx={{ overflow: 'hidden' }}>
        <SchedulerHeader
          plan={plan}
          addHotel={handleAddHotel}
          updateTitle={handleUpdate}
        />
        <Scheduler plan={plan} planApi={planApi} />
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={plan.waypoints?.length === 0}
        autoHideDuration={6000}>
        <Alert severity={'info'}>地図上で行きたい場所を選んでください。</Alert>
      </Snackbar>
    </>
  )
}

export default ScheduleView
