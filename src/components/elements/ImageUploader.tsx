import * as React from 'react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  buttonProps?: IconButtonProps<'label'>
}
const ImageUploader = React.forwardRef<HTMLInputElement, Props>(
  function ImageUploader({ buttonProps, ...props }, ref) {
    return (
      <IconButton component="label" {...buttonProps}>
        <input ref={ref} hidden type="file" accept="image/*" {...props} />
        <SvgIcon>
          <FontAwesomeIcon icon={faImage} />
        </SvgIcon>
      </IconButton>
    )
  }
)

export default ImageUploader
