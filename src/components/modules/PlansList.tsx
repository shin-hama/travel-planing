import * as React from 'react'
import Grid from '@mui/material/Grid'

import { Plan } from 'contexts/CurrentPlanProvider'
import TravelPlanCard from './TravelPlanCard'
import { QuerySnapshot } from 'firebase/firestore'

type Props = {
  plans: QuerySnapshot<Plan>
}
const PlansList: React.FC<Props> = ({ plans }) => {
  return (
    <Grid container spacing={2}>
      {plans.docs.map((doc) => (
        <Grid
          key={doc.id}
          item
          xs={12}
          sm={6}
          alignItems="center"
          sx={{ minHeight: '40vh' }}>
          <TravelPlanCard plan={doc.ref} />
        </Grid>
      ))}
    </Grid>
  )
}

export default PlansList
