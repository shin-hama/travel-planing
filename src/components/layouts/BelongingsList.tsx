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
  const [added, setAdded] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  const handleAddBelonging = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const value = (e.target as HTMLTextAreaElement).value.trim()
    console.log(e)
    if (e.keyCode === 13 && Boolean(value)) {
      planApi.update({
        belongings: [
          ...(plan?.belongings || []),
          { name: value, checked: false },
        ],
      })

      e.target.value = ''
      setAdded(true)
    }
  }

  React.useEffect(() => {
    if (added) {
      // 持ち物追加後に、自動でテキストエリアにスクロールする
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      setAdded(false)
    }
  }, [added])

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
        </Stack>
      </FormGroup>
      <TextField
        ref={ref}
        variant="standard"
        placeholder="+ Add new item"
        onKeyDown={handleAddBelonging}
      />
    </Stack>
  )
}

export default BelongingsList
