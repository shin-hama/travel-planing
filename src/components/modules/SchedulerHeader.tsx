import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faPen } from '@fortawesome/free-solid-svg-icons'
import { useAsyncFn } from 'react-use'
import { useForm } from 'react-hook-form'

import { useConfirm } from 'hooks/useConfirm'
import { Plan } from 'contexts/CurrentPlanProvider'

type Props = {
  plan: Plan
  addHotel: () => void
  optimizeRoute: () => Promise<void>
  updateTitle: (newTitle: string) => void
}
const SchedulerHeader: React.FC<Props> = ({
  plan,
  addHotel,
  optimizeRoute,
  updateTitle,
}) => {
  const [editTitle, setEditTitle] = React.useState(false)
  const { register, handleSubmit } = useForm<{ title: string }>()
  const confirm = useConfirm()
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)

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

      await optimizeRoute()
    } catch (e) {
      console.error(e)
    }
  }, [confirm, optimizeRoute])

  const handleUpdate = (data: { title: string }) => {
    updateTitle(data.title)
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
    <>
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
            <Button variant="contained" onClick={handleSubmit(handleUpdate)}>
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
            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </IconButton>
          </>
        )}
      </Stack>
      <Menu
        id="basic-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        <MenuItem onClick={handleOptimize}>ルート最適化</MenuItem>
        <MenuItem onClick={addHotel}>ホテルを追加</MenuItem>
      </Menu>
    </>
  )
}

export default SchedulerHeader
