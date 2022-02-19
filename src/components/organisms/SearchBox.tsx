import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const SearchBox = () => {
  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState('')

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

  return (
    <>
      <FontAwesomeIcon icon={faSearch} onClick={handleOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <TextField value={text} onChange={handleChanged} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SearchBox
