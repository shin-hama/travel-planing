import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Input from '@mui/material/Input'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

const ImageUploader = React.forwardRef<
  HTMLDivElement,
  React.InputHTMLAttributes<unknown>
>(function ImageUploader(props, ref) {
  return (
    <IconButton component="label">
      <Input
        ref={ref}
        type="file"
        inputProps={{ ...props, accept: 'image/*' }}
        sx={{ display: 'none' }}
      />
      <SvgIcon>
        <FontAwesomeIcon icon={faImage} />
      </SvgIcon>
    </IconButton>
  )
})

export default ImageUploader
