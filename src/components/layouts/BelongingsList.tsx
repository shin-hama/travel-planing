import * as React from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faClose } from '@fortawesome/free-solid-svg-icons'

import { usePlan } from 'hooks/usePlan'
import { Belonging } from 'contexts/CurrentPlanProvider'

const BelongingsList: React.FC = () => {
  const [{ data: plan }, planApi] = usePlan()
  const [added, setAdded] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  const handleAddBelonging = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLTextAreaElement
    if (e.keyCode === 13 && Boolean(target.value.trim())) {
      planApi.update({
        belongings: [
          ...(plan?.belongings || []),
          { name: target.value, checked: false },
        ],
      })

      target.value = ''
      setAdded(true)
    }
  }

  const handleRemove = (removed: Belonging) => () => {
    planApi.update({
      belongings: plan?.belongings.filter((item) => item !== removed),
    })
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
    <Stack spacing={1}>
      <Typography variant="h1">持ち物リスト</Typography>
      <FormGroup>
        <Stack>
          {plan?.belongings.map((item, i) => (
            <FormControlLabel
              key={`${item.name}-${i}`}
              control={<Checkbox checked={item.checked} />}
              label={
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ width: '100%', mr: 1 }}>
                  <Typography noWrap>{item.name}</Typography>
                  <IconButton onClick={handleRemove(item)}>
                    <SvgIcon>
                      <FontAwesomeIcon icon={faClose} />
                    </SvgIcon>
                  </IconButton>
                </Stack>
              }
              disableTypography
              onChange={() => console.log('change')}
              sx={{
                m: 0,
                width: '100%',
                background: (theme) =>
                  i % 2 === 0 ? theme.palette.grey[100] : 'inherit',
              }}
            />
          ))}
        </Stack>
      </FormGroup>
      <Stack alignItems="center" direction="row">
        {/* チェックボックスと整列させるために幅を42pxにしている。余裕があれば、チェックボックスとテキストフィールドを同じコンポーネントで作成する */}
        <IconButton sx={{ width: '42px' }}>
          <SvgIcon>
            <FontAwesomeIcon icon={faAdd} />
          </SvgIcon>
        </IconButton>
        <TextField
          ref={ref}
          fullWidth
          variant="standard"
          placeholder="Add new item"
          onKeyDown={handleAddBelonging}
        />
      </Stack>
    </Stack>
  )
}

export default BelongingsList
