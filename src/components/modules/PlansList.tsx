import * as React from 'react'
import Grid from '@mui/material/Grid'

import { Plan } from 'contexts/CurrentPlanProvider'
import TravelPlanCard from './TravelPlanCard'

type Props = {
  plans: Array<Plan>
}
const PlansList: React.FC<Props> = ({ plans }) => {
  return (
    <Grid container spacing={2}>
      {plans.map((plan) => (
        <Grid
          key={plan.id}
          item
          xs={12}
          sm={6}
          alignItems="center"
          sx={{ minHeight: '20vh' }}>
          <TravelPlanCard plan={plan} />
        </Grid>
      ))}
    </Grid>
  )
}

export default PlansList
