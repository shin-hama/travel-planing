import * as React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useGetSpotsWithMatchingNameLazyQuery } from 'generated/graphql'
import SpotsList from '../SpotsList'
import { useToggle } from 'react-use'
import { usePlaces } from 'hooks/googlemaps/usePlaces'
import { useGoogleMap } from '@react-google-maps/api'
import { SpotDTO } from 'hooks/useSchedules'

const NUM_CARD = 7

const SearchBox = () => {
  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState('')
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const [advance, toggleMode] = useToggle(false)
  const { search } = usePlaces()
  const maps = useGoogleMap()

  const [getSpots, { loading, error }] = useGetSpotsWithMatchingNameLazyQuery()
  const [searchedSpots, setSearchedSpots] = React.useState<Array<SpotDTO>>([])
  const [end, setEnd] = React.useState(NUM_CARD)

  React.useEffect(() => {
    setEnd(NUM_CARD)
  }, [searchedSpots])

  const handleLoadMore = React.useCallback(() => {
    setEnd((prev) => prev + NUM_CARD)
  }, [])

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
      if (advance) {
        const result = await search({ query: text, bounds: maps?.getBounds() })
        setSearchedSpots(result)
      } else {
        const { data } = await getSpots({ variables: { name: `.*${text}.*` } })
        setSearchedSpots(data?.spots || [])
      }
    }, 500)
  }, [getSpots, text, advance, search, maps])

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
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
        <DialogContent id="scrollableDiv">
          <Stack direction="row" alignItems="center" spacing={2}>
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
            <FormControlLabel
              control={
                <Switch checked={advance} onChange={toggleMode} size="small" />
              }
              label={
                <Typography variant="caption">
                  {advance ? 'Pro (β)' : 'Normal'}
                </Typography>
              }
              labelPlacement="top"
            />
          </Stack>
          <Box pt={2}>
            {error ? (
              <Typography>Error</Typography>
            ) : loading ? (
              <Typography>Now Searching ...</Typography>
            ) : (
              <Container maxWidth="xs">
                {searchedSpots.length > 0 ? (
                  <InfiniteScroll
                    dataLength={searchedSpots.slice(0, end).length}
                    next={handleLoadMore}
                    hasMore={searchedSpots.length >= end}
                    loader={<Typography>Load More ...</Typography>}
                    endMessage={<></>}
                    scrollableTarget="scrollableDiv">
                    <SpotsList spots={searchedSpots.slice(0, end)} />
                  </InfiniteScroll>
                ) : (
                  <Typography>No result</Typography>
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
