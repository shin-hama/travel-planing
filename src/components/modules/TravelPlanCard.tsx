import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useRouter } from 'hooks/useRouter'
import { DocumentReference } from 'firebase/firestore'
import { useDocument } from 'hooks/firebase/useDocument'
import { Plan } from 'contexts/CurrentPlanProvider'

type Props = {
  plan: DocumentReference<Plan>
}
const TravelPlanCard: React.FC<Props> = ({ plan: ref }) => {
  const [plan] = useDocument<Plan>(ref)
  const router = useRouter()

  const handleClick = () => {
    router.userPlan(ref.id)
  }

  return (
    <Card onClick={handleClick} sx={{ height: '100%' }}>
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          overflow: 'hidden',
          borderRadius: 1,
          '&:hover': {
            cursor: 'pointer',
          },
        }}>
        <Box
          sx={{
            height: '100%',
            gridArea: '1/-1',
            backgroundImage: `url(${plan?.image.url})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            gridArea: '1/-1',
            background: 'linear-gradient(to top, transparent 60%, #0000009c)',
            alignItems: 'start',
            justifyContent: 'start',
            textAlign: 'start',
          }}>
          <Stack sx={{ pl: 1, pt: 0.5, color: 'white' }}>
            <Typography variant="h4">{plan?.title}</Typography>
            <Typography variant="subtitle2">
              {plan?.start.toLocaleDateString([])}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Card>
  )
}

export default TravelPlanCard
