import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import LoginForm from './LoginForm'
import { useAuthentication } from 'hooks/useAuthentication'

const Header = () => {
  const [user, auth] = useAuthentication()
  const [open, setOpen] = React.useState<'signIn' | 'signUp' | null>(null)

  return (
    <>
      <AppBar color="inherit">
        <Toolbar variant="dense">
          <div style={{ flexGrow: 1 }} />
          {user ? (
            <IconButton onClick={auth.signOut}>
              <FontAwesomeIcon icon={faUser} />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpen('signIn')}>
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen('signUp')}>
                Sign Up
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar variant="dense" />
      <LoginForm
        open={Boolean(open)}
        isSignUp={open === 'signUp'}
        onClose={() => setOpen(null)}
      />
    </>
  )
}

export default Header
