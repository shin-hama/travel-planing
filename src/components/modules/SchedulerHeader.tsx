import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { useAsyncFn } from 'react-use'
import { useForm } from 'react-hook-form'

import { useConfirm } from 'hooks/useConfirm'
import { useTravelPlan } from 'hooks/useTravelPlan'

const SchedulerHeader = () => {
  const [editTitle, setEditTitle] = React.useState(false)
  const { register, handleSubmit } = useForm<{ title: string }>()
  const confirm = useConfirm()
  const [plan, planApi] = useTravelPlan()

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

  if (loading) {
    return (
      <Backdrop open={loading} sx={{ zIndex: 1 }}>
        <CircularProgress />
      </Backdrop>
    )
  }

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {editTitle ? (
        <>
          <TextField
            {...register('title')}
            defaultValue={plan?.title}
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
            {plan?.title}
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
  )
}

export default SchedulerHeader
