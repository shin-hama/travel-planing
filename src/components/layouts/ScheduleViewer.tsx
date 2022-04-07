import * as React from 'react'
import Alert from '@mui/material/Alert'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import Fab from '@mui/material/Fab'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Snackbar from '@mui/material/Snackbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapLocationDot, faPen } from '@fortawesome/free-solid-svg-icons'
import { useAsyncFn } from 'react-use'
import { useForm } from 'react-hook-form'

import EventsScheduler from 'components/modules/EventsScheduler'
import PlanningLayout from 'components/layouts/PlaningLayout'
import { useConfirm } from 'hooks/useConfirm'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { useRouter } from 'hooks/useRouter'

type Props = {
  open: boolean
  onClose: () => void
}
const ScheduleViewer: React.FC<Props> = ({ open, onClose }) => {
  const router = useRouter()
  const confirm = useConfirm()
  const [plan, planApi] = useTravelPlan()
  const [editTitle, setEditTitle] = React.useState(false)
  const { register, handleSubmit } = useForm<{ title: string }>()

  const [{ loading }, handleOptimize] = useAsyncFn(async () => {
    try {
      try {
        await confirm({
          allowClose: false,
          description:
            'Optimize your plan.\nWARNING: Current plan will be overwritten',
        })
      } catch {
        // when cancel
        return
      }

      await planApi.optimizeRoute()
    } catch (e) {
      console.error(e)
    }
  }, [confirm, planApi.optimizeRoute])

  const updateTitle = (data: { title: string }) => {
    planApi.update({ title: data.title })
    setEditTitle(false)
  }

  React.useEffect(() => {
    if (!plan) {
      router.userHome(true)
    }
  }, [plan, router])

  if (!plan) {
    return <></>
  }

  return (
    <Drawer open={open} anchor="bottom" onClose={onClose}>
      {loading && (
        <Backdrop open={loading} sx={{ zIndex: 1 }}>
          <CircularProgress />
        </Backdrop>
      )}
      <PlanningLayout>
        <Container
          maxWidth="md"
          sx={{
            display: 'flex',
            flexFlow: 'column',
            height: '100%',
          }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {editTitle ? (
              <>
                <TextField
                  {...register('title')}
                  defaultValue={plan.title}
                  fullWidth
                  size="small"
                />
                <Button variant="outlined" onClick={() => setEditTitle(false)}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit(updateTitle)}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h4" component="h2" noWrap>
                  {plan.title}
                </Typography>
                <IconButton onClick={() => setEditTitle(true)}>
                  <FontAwesomeIcon size="xs" icon={faPen} />
                </IconButton>
                <Box flexGrow={1} />
                <Button variant="contained" onClick={handleOptimize}>
                  最適化
                </Button>
              </>
            )}
          </Stack>
          <Box sx={{ height: '100%', zIndex: 0 }}>
            <EventsScheduler plan={plan} planApi={planApi} />
          </Box>
          <Fab
            onClick={onClose}
            color="primary"
            sx={{
              position: 'fixed',
              right: 16,
              bottom: 16,
            }}>
            <FontAwesomeIcon icon={faMapLocationDot} size="lg" />
          </Fab>
        </Container>
      </PlanningLayout>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={plan.waypoints?.length === 0}
        autoHideDuration={6000}>
        <Alert severity={'info'}>地図上で行きたい場所を選んでください。</Alert>
      </Snackbar>
    </Drawer>
  )
}

export default ScheduleViewer
