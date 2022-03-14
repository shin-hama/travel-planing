import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Stack from '@mui/material/Stack'

import JapanMap from 'components/elements/JapanMap'
import { Prefecture } from 'contexts/CurrentPlanProvider'
import { useGetPrefecturesQuery } from 'generated/graphql'
import { useUnsplash } from 'hooks/useUnsplash'

export type Props = {
  open: boolean
  onOK?: (selected: Prefecture) => void
  onClose?: () => void
}
const SelectPrefectureDialog: React.FC<Props> = ({ open, onOK, onClose }) => {
  const { data, loading, error } = useGetPrefecturesQuery()
  const unsplash = useUnsplash()

  const handleClick = async (prefectureCode: number) => {
    if (!data) {
      return
    }

    const prefecture = data.prefectures.find(
      (item) => item.code === prefectureCode
    )
    if (prefecture) {
      const photo = await unsplash.searchPhoto(prefecture.name_en)
      onOK?.({
        ...prefecture,
        placeId: prefecture.place_id,
        imageUrl: photo.urls.regular,
      })
    }
  }

  if (error) {
    console.error(error)
  }

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogContent>
        <Stack alignItems="center" sx={{ height: '100%', pb: 1 }}>
          {loading ? (
            <>Now Loading...</>
          ) : (
            <JapanMap onClickPrefecture={handleClick} />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SelectPrefectureDialog
