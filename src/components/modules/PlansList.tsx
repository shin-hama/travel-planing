import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const PlansList = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} alignItems="center">
        <Card>
          <CardContent>
            <Typography variant="h4" component="h3">
              Title
            </Typography>
            <Typography variant="subtitle2">XXXX/YY/ZZ</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} alignItems="center">
        <Card>
          <CardContent>
            <Typography variant="h4" component="h3">
              Title
            </Typography>
            <Typography variant="subtitle2">XXXX/YY/ZZ</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} alignItems="center">
        <Card>
          <CardContent>
            <Typography variant="h4" component="h3">
              Title
            </Typography>
            <Typography variant="subtitle2">XXXX/YY/ZZ</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PlansList
