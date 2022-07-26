import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Image from 'next/image'

import ImageUploader from 'components/elements/ImageUploader'

type Props = {
  src?: string
  onChange?: (file: File) => void
}
export const ImageWithUploader = React.forwardRef<HTMLInputElement, Props>(
  function ImageWithUploader({ src, onChange }, ref) {
    return src ? (
      <Box
        sx={{
          display: 'grid',
          position: 'relative',
        }}>
        <Box gridArea="1/1">
          <Image
            src={src}
            width="21"
            height="9"
            layout="responsive"
            objectFit="cover"
          />
        </Box>
        <Box gridArea={'1/1'} justifySelf="flex-end" m={1}>
          <ImageUploader
            ref={ref}
            onChange={(e) => {
              if (e.target.files?.length === 1) {
                onChange?.(e.target.files[0])
              }
            }}
            buttonProps={{
              color: 'inherit',
              sx: {
                background: (theme) => theme.palette.grey[100],
                '&:hover': {
                  background: (theme) => theme.palette.grey[400],
                },
              },
            }}
          />
        </Box>
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
