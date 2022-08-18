import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

import SpotsList from 'components/modules/SpotsList'
import { Plan } from 'contexts/CurrentPlanProvider'
import { useEvents } from 'hooks/useEvents'

type Props = {
  plan: Plan
}
const PlanInfo: React.FC<Props> = ({ plan }) => {
  const [events] = useEvents()
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
        <TextField label="Comment" multiline rows={4} />
      </Stack>
      <Stack spacing={2} alignItems="center" maxHeight="500px">
        <Typography variant="h2" textAlign="left" sx={{ width: '100%' }}>
          行きたいところリスト
        </Typography>
        {events ? (
          <Box minWidth="360px" overflow="auto">
            <SpotsList spots={events.map((e) => e.data())} />
          </Box>
        ) : (
          <Typography variant="subtitle1">
            地図上で行きたい場所を選んでください。
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}

export default PlanInfo
