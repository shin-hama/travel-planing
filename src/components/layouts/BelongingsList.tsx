import * as React from 'react'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'

import { Plan } from 'contexts/CurrentPlanProvider'

type Props = {
  plan: Plan
}
const BelongingsList: React.FC<Props> = ({ plan }) => {
  return <Typography variant="h1">持ち物リスト</Typography>
}

export default BelongingsList
