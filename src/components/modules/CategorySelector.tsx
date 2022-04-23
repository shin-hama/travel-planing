import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

import { useGetCategoriesQuery } from 'generated/graphql'

type Props = {
  onChange?: (value: number | null) => void
}
const CategorySelector: React.FC<Props> = ({ onChange: changedCallback }) => {
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const [label, setLabel] = React.useState('')
  const { data, loading, error } = useGetCategoriesQuery()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  React.useEffect(() => {
    changedCallback?.(selectedId)
    // not update callback when mapBounds is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = Number.parseInt(event.target.value)
    setSelectedId(id)

    // なにか選択されたら選択肢の一覧を閉じる
    setAnchorEl(null)
  }

  React.useEffect(() => {
    if (data?.categories && data.categories.length > 0) {
      setSelectedId(data.categories[0].id || 0)
    }

    return () => {
      setSelectedId(null)
    }
  }, [data?.categories])

  React.useEffect(() => {
    setLabel(
      data?.categories.find((item) => item.id === selectedId)?.name || ''
    )
  }, [data?.categories, selectedId])

  if (error) {
    console.error('Fail to load categories')
  }

  if (loading) {
    return <>...Now loading</>
  }

  return (
    <>
      <Button
        size="small"
        variant="contained"
        onClick={handleClick}
        color="inherit"
        sx={{
          color: 'black',
          background: 'white',
        }}>{`Category: ${label}`}</Button>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ width: '80%' }}>
        <Paper>
          <Box sx={{ p: 1.5 }}>
            <FormControl>
              <FormLabel id="categories-group-label">Categories</FormLabel>
              <RadioGroup
                row
                aria-labelledby="categories-group-label"
                name="categories-group"
                onChange={handleChange}
                value={selectedId}>
                {data?.categories.map((category) => (
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
