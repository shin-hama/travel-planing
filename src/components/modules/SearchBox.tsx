import * as React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons'

import { useGetSpotsWithMatchingNameLazyQuery } from 'generated/graphql'
import SpotsList from './SpotsList'

const SearchBox = () => {
  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState('')
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

  const [getSpots, { loading, error }] = useGetSpotsWithMatchingNameLazyQuery()
  const [searchedSpots, setSearchedSpots] = React.useState<Array<string>>([])

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setText('')
    setSearchedSpots([])
    setOpen(false)
  }

  const handleChanged = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setText(e.target.value)
  }

  React.useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    if (text === '') {
      return
    }

    // 連続入力中に検索用の API が連続で呼ばれないようにする
    timerRef.current = setTimeout(async () => {
      const { data } = await getSpots({ variables: { name: `.*${text}.*` } })
      if (data) {
        setSearchedSpots(data.spots.map((spot) => spot.place_id))
      }
    }, 500)
  }, [getSpots, text])

  return (
    <>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          borderRadius: 2,
        }}>
        <IconButton
          disableTouchRipple
          onClick={handleOpen}
          sx={{ borderRadius: 2 }}>
          <FontAwesomeIcon size="xs" icon={faSearch} />
        </IconButton>
      </Box>
      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        fullScreen={isSmall}
        onClose={handleClose}
        sx={{
          '& .MuiDialog-scrollPaper': {
            // ダイアログを画面上部に表示する
            alignItems: 'self-start',
          },
        }}>
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <IconButton disableTouchRipple onClick={handleClose}>
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
            <TextField
              fullWidth
              variant="standard"
              value={text}
              onChange={handleChanged}
              placeholder="Search..."
            />
          </Stack>
          <Box pt={2}>
            {error ? (
              <>Error</>
            ) : loading ? (
              <>Now loading...</>
            ) : (
              <Container maxWidth="xs">
                {searchedSpots.length > 0 ? (
                  <SpotsList spots={searchedSpots} />
                ) : (
                  <>No result</>
                )}
              </Container>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SearchBox
