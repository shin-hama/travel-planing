import * as React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

import { useGetCategoriesQuery } from 'generated/graphql'

type Props = {
  onChange?: (value: string) => void
}
const CategorySelector: React.FC<Props> = ({ onChange: changedCallback }) => {
  const { data, loading, error } = useGetCategoriesQuery()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event)
    changedCallback?.(event.target.value)
  }

  React.useEffect(() => {
    console.log(data)
  }, [data])

  if (error) {
    console.error('Fail to load categories')
  }

  if (loading) {
    return <>...Now loading</>
  }

  return (
    <FormControl>
      <FormLabel id="categories-group-label">Category</FormLabel>
      <RadioGroup
        row
        aria-labelledby="categories-group-label"
        name="categories-group"
        onChange={handleChange}>
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
  )
}

export default CategorySelector
