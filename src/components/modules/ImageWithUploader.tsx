import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faTrash } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

import ImageUploader from 'components/elements/ImageUploader'

type Props = {
  src?: string
  onChange?: (file: File) => void
  onRemove?: () => void
}
export default React.forwardRef<HTMLInputElement, Props>(
  function ImageWithUploader({ src, onChange, onRemove }, ref) {
    return src ? (
      <Box
        sx={{
          display: 'grid',
          position: 'relative',
        }}>
        <Box gridArea="1/1">
          <Image
            src={src}
            alt="image"
            width="21"
            height="9"
            layout="responsive"
            objectFit="cover"
          />
        </Box>
        <Stack spacing={1} gridArea={'1/1'} justifySelf="flex-end" m={1}>
          <IconButton
            component="label"
            color="inherit"
            sx={{
              background: (theme) => theme.palette.grey[100],
              '&:hover': {
                background: (theme) => theme.palette.grey[400],
              },
            }}>
            <input
              ref={ref}
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.length === 1) {
                  onChange?.(e.target.files[0])
                }
              }}
            />
            <SvgIcon>
              <FontAwesomeIcon icon={faImage} />
            </SvgIcon>
          </IconButton>
          <IconButton
            onClick={onRemove}
            color="inherit"
            sx={{
              background: (theme) => theme.palette.grey[100],
              '&:hover': {
                background: (theme) => theme.palette.grey[400],
              },
            }}>
            <SvgIcon>
              <FontAwesomeIcon icon={faTrash} />
            </SvgIcon>
          </IconButton>
        </Stack>
      </Box>
    ) : (
      <Box alignSelf="center" py={1}>
        <Button
          component="label"
          variant="contained"
          size="small"
          startIcon={
            <ImageUploader
              ref={ref}
              onChange={(e) => {
                if (e.target.files?.length === 1) {
                  onChange?.(e.target.files[0])
                }
              }}
              buttonProps={{ size: 'small', color: 'inherit' }}
            />
          }>
          Upload
        </Button>
      </Box>
    )
  }
)
