import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faPen } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'

import { Plan } from 'contexts/CurrentPlanProvider'
import PlanMenu from '../PlanMenu'

type Props = {
  plan: Plan
  updateTitle: (newTitle: string) => void
}
const SchedulerHeader: React.FC<Props> = ({ plan, updateTitle }) => {
  const [editTitle, setEditTitle] = React.useState(false)
  const { register, handleSubmit } = useForm<{ title: string }>()
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)

  const handleUpdate = (data: { title: string }) => {
    updateTitle(data.title)
    setEditTitle(false)
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
      <PlanMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      />
    </>
  )
}

export default SchedulerHeader
