import * as React from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useTravelPlan } from 'hooks/useTravelPlan'

const BelongingsList: React.FC = () => {
  const [plan, planApi] = useTravelPlan()

  const handleComplete = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(e)
    if (e.code === 'Enter') {
      console.log(e.target.value)
      planApi.update({
        belongings: [
          ...(plan?.belongings || []),
          { name: e.target.value, checked: false },
        ],
      })
    }
  }

  console.log(plan)
  return (
    <Stack>
      <Typography variant="h1">持ち物リスト</Typography>
      <FormGroup>
        <Stack>
          {plan?.belongings.map((item, i) => (
            <FormControlLabel
              key={`${item.name}-${i}`}
              control={<Checkbox checked={item.checked} />}
              label={item.name}
              onChange={() => console.log('change')}
            />
          ))}
          <TextField
            variant="standard"
            placeholder="+ Add new item"
            onKeyDown={handleComplete}
          />
        </Stack>
      </FormGroup>
    </Stack>
  )
}

export default BelongingsList
