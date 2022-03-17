import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  icon: IconProp
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}
const SquareIconButton: React.FC<Props> = ({ icon, onClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: (theme) => theme.palette.primary.main,
        borderRadius: 2,
        height: '34px',
        width: '34px',
      }}>
      <IconButton disableTouchRipple onClick={onClick} sx={{ borderRadius: 2 }}>
        <FontAwesomeIcon color="white" size="xs" icon={icon} />
      </IconButton>
    </Box>
  )
}

export default SquareIconButton
