import * as React from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

import { Plan } from 'contexts/CurrentPlanProvider'

type Props = {
  plan: Plan
  onUpdate: (updated: Partial<Plan>) => void
}
const PlanInfo: React.FC<Props> = ({ plan, onUpdate }) => {
  const [comment, setComment] = React.useState(plan.comment || '')
  const edited = React.useMemo(
    () => comment !== plan.comment,
    [comment, plan.comment]
  )

  return (
    <Stack spacing={4}>
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="start">
          <Typography variant="h1" noWrap>
            {plan?.title}
          </Typography>
          <IconButton disabled>
            <SvgIcon>
              <FontAwesomeIcon icon={faEdit} />
            </SvgIcon>
          </IconButton>
        </Stack>
        <Typography variant="subtitle2">
          {`${plan.start.toLocaleDateString()} ~ ${plan.end.toLocaleDateString()}`}
        </Typography>
        <Typography variant="caption">
          {`from ${plan.home.name} to ${plan.destination.name}`}
        </Typography>
      </Stack>
      <Stack spacing={2}>
        <Typography variant="h2" textAlign="left" sx={{ width: '100%' }}>
          コメント
        </Typography>
        <TextField
          label="Comment"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
            console.log('test')
          }}
        />
        {edited && (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={() => setComment(plan.comment || '')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => onUpdate({ comment })}>
              Save
            </Button>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default PlanInfo
