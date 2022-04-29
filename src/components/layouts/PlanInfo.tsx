import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

import SpotsList from 'components/modules/SpotsList'
import { Plan } from 'contexts/CurrentPlanProvider'

type Props = {
  plan: Plan
}
const PlanInfo: React.FC<Props> = ({ plan }) => {
  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="start">
        <Stack>
          <Typography variant="h1" noWrap>
            {plan?.title}
          </Typography>
          <Typography variant="subtitle2">
            {`${plan.start.toLocaleDateString()} ~ ${plan.end.toLocaleDateString()}`}
          </Typography>
          <Typography variant="caption">
            {`from ${plan.home.name} to ${plan.destination.name}`}
          </Typography>
        </Stack>
        <IconButton disabled>
          <SvgIcon>
            <FontAwesomeIcon icon={faEdit} />
          </SvgIcon>
        </IconButton>
      </Stack>
      <Stack spacing={2}>
        <Typography variant="h2">行きたいところリスト</Typography>
        {plan.waypoints.length > 0 ? (
          <SpotsList spots={plan.waypoints} />
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
