import * as React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

import { useGetCategoriesQuery } from 'generated/graphql'

type Props = {
  onChange?: (value: number) => void
}
const CategorySelector: React.FC<Props> = ({ onChange: changedCallback }) => {
  const [selectedId, setSelectedId] = React.useState(0)
  const [label, setLabel] = React.useState('')
  const { data, loading, error } = useGetCategoriesQuery()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event.currentTarget)
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  React.useEffect(() => {
    changedCallback?.(selectedId)
  }, [changedCallback, selectedId])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = Number.parseInt(event.target.value)
    setSelectedId(id)
  }

  React.useEffect(() => {
    if (data?.categories && data.categories.length > 0) {
      setSelectedId(data.categories[0].id || 0)
    }
  }, [data?.categories])

  React.useEffect(() => {
    setLabel(data?.categories.find(item => item.id === selectedId)?.name || '')
  }, [data?.categories, selectedId])

  if (error) {
    console.error('Fail to load categories')
  }

  if (loading) {
    return <>...Now loading</>
  }

  return (
    <>
      <Chip label={`Category: ${label}`} onClick={handleClick} />
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ width: '80%' }}>
        <Paper>
          <Box>
            <FormControl>
              <FormLabel id="categories-group-label">Category</FormLabel>
              <RadioGroup
                row
                aria-labelledby="categories-group-label"
                name="categories-group"
                onChange={handleChange}
                value={selectedId}>
                {data?.categories.map(category => (
                  <FormControlLabel
                    key={category.id}
                    value={category.id}
                    control={<Radio />}
                    label={category.name}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </Paper>
      </Popper>
    </>
  )
}

export default CategorySelector
