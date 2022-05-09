import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar, faMapLocationDot } from '@fortawesome/free-solid-svg-icons'

const Route = () => {
  return (
    <Stack direction="row" alignItems="center">
      <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
        <IconButton>
          <SvgIcon>
            <FontAwesomeIcon icon={faCar} />
          </SvgIcon>
        </IconButton>
        <Typography>10 分</Typography>
      </Stack>
      <IconButton>
        <SvgIcon>
          <FontAwesomeIcon icon={faMapLocationDot} />
        </SvgIcon>
      </IconButton>
    </Stack>
  )
}

export default Route
