import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import SpotCard from './SpotCard'
import { useSelectedPlacesActions } from 'contexts/SelectedPlacesProvider'
import { useGetSpotsWithMatchingNameLazyQuery } from 'generated/graphql'

const SearchBox = () => {
  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState('')
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const actions = useSelectedPlacesActions()

  const [getSpots, { data, loading, error }] =
    useGetSpotsWithMatchingNameLazyQuery()

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setText('')
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

    timerRef.current = setTimeout(() => {
      console.log('test')
      getSpots({ variables: { name: `.*${text}.*` } })
    }, 500)
  }, [getSpots, text])

  const handleClickAdd = React.useCallback(
    (placeId: string) => () => {
      actions.push({ placeId })
    },
    [actions]
  )

  return (
    <>
      <Box
        sx={{
          backgroundColor: theme => theme.palette.primary.main,
          borderRadius: 2,
        }}>
        <IconButton
          disableTouchRipple
          onClick={handleOpen}
          sx={{ borderRadius: 2 }}>
          <FontAwesomeIcon color="white" size="xs" icon={faSearch} />
        </IconButton>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
          <TextField
            fullWidth
            value={text}
            onChange={handleChanged}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faSearch} onClick={handleOpen} />
                </InputAdornment>
              ),
            }}
          />
          <Box pt={2}>
            {error ? (
              <>Error</>
            ) : loading ? (
              <>Now loading...</>
            ) : (
              <Container maxWidth="xs">
                <Stack spacing={2}>
                  {data?.spots.map(spot => (
                    <SpotCard
                      key={spot.place_id}
                      placeId={spot.place_id}
                      actionNode={
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleClickAdd(spot.place_id)}
                          sx={{ marginLeft: 'auto' }}>
                          Add
                        </Button>
                      }
                    />
                  ))}
                </Stack>
              </Container>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SearchBox
