import * as React from 'react'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap } from '@fortawesome/free-solid-svg-icons'

import { Prefecture } from 'contexts/CurrentPlanProvider'
import SelectPrefectureDialog, {
  Props as DialogProps,
} from 'components/modules/SelectPrefectureDialog'
import { useGetPrefecturesQuery } from 'generated/graphql'

type Props = {
  value?: Prefecture
  label?: string
  onChange: (value: Omit<Prefecture, 'imageUrl'>) => void
}
const PrefectureSelector: React.FC<Props> = ({ value, label, onChange }) => {
  const [openDialog, setOpenDialog] = React.useState<DialogProps>({
    open: false,
  })
  const { data, loading, error } = useGetPrefecturesQuery()

  const handleChange = (event: SelectChangeEvent<number | string>) => {
    if (!data) {
      return
    }

    const prefecture = data.prefectures.find(
      (item) => item.code === event.target.value
    )

    if (prefecture) {
      onChange?.({
        ...prefecture,
        placeId: prefecture.place_id,
      })
    }
  }

  if (error) {
    console.error(error)
  }
  const handleClick = async () => {
    try {
      const selected = await new Promise<Omit<Prefecture, 'imageUrl'>>(
        (resolve, reject) => {
          setOpenDialog({
            open: true,
            onOK: resolve,
            onClose: reject,
          })
        }
      )
      onChange?.(selected)
    } finally {
      setOpenDialog({ open: false })
    }
  }

  return (
    <>
      <FormControl size="small" sx={{ width: '50%' }}>
        <InputLabel id={`prefecture-selector-${label}-label`}>
          {label}
        </InputLabel>
        <Select
          label={label}
          id={`prefecture-selector-${label}`}
          value={
            data?.prefectures.find((p) => p.place_id === value?.placeId)
              ?.code || ''
          }
          onChange={handleChange}>
          {loading ? (
            <>loading</>
          ) : (
            data?.prefectures.map((prefecture) => (
              <MenuItem key={prefecture.code} value={prefecture.code}>
                {prefecture.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
      <IconButton color="primary" onClick={handleClick}>
        <SvgIcon>
          <FontAwesomeIcon icon={faMap} />
        </SvgIcon>
      </IconButton>
      <SelectPrefectureDialog {...openDialog} />
    </>
  )
}

export default PrefectureSelector
