import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

type Props = {
  title: string
  category: string
}
const SpotCard: React.FC<Props> = ({ title }) => {
  return (
    <Card>
      <CardHeader title={title}></CardHeader>
      <CardContent>some content</CardContent>
    </Card>
  )
}

export default SpotCard
