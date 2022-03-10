import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import { useAuthentication } from 'hooks/useAuthentication'

const Header = () => {
  const [user, auth] = useAuthentication()

  return (
    <AppBar color="inherit">
      <Toolbar>
        <div style={{ flexGrow: 1 }} />
        {user ? (
          <IconButton onClick={auth.signOut}>
            <FontAwesomeIcon icon={faUser} />
          </IconButton>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" color="primary">
              Login
            </Button>
            <Button variant="contained" color="primary">
              Sign Up
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
