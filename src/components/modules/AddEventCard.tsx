import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

type Props = {
  text: string
  onClick: () => void
}
const AddEventCard: React.FC<Props> = ({ text, onClick }) => {
  return (
    <Box
      fullWidth
      color="black"
      component={Button}
      onClick={onClick}
      sx={{
        aspectRatio: '4/1',
        border: (theme) => `dashed ${theme.palette.grey[300]} 2px`,
        borderRadius: 2,
      }}>
      <Typography textAlign="center" variant="h6">
        {text}
      </Typography>
    </Box>
  )
}

export default AddEventCard
