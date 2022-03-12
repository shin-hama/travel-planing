import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { Plan } from 'contexts/CurrentPlanProvider'

type Props = {
  plans: Array<Plan>
}
const PlansList: React.FC<Props> = ({ plans }) => {
  return (
    <Grid container spacing={2}>
      {plans.map((plan) => (
        <Grid key={plan.id} item xs={12} sm={6} alignItems="center">
          <Card>
            <CardContent>
              <Typography variant="h4" component="h3">
                {plan.title}
              </Typography>
              <Typography variant="subtitle2">
                {plan.start?.toDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default PlansList
