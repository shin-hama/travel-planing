import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import LoginForm from './LoginForm'
import { useAuthentication } from 'hooks/firebase/useAuthentication'
import { StepperHandlerContext } from 'components/pages/PlaningMain'

const Header = () => {
  const setStep = React.useContext(StepperHandlerContext)

  const [user, auth] = useAuthentication()
  const [open, setOpen] = React.useState<'signIn' | 'signUp' | null>(null)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    auth.signOut()
    handleCloseUserMenu()
  }

  return (
    <>
      <AppBar color="inherit">
        <Toolbar variant="dense">
          <Button
            color="inherit"
            onClick={() => setStep('Home')}
            sx={{ mr: 1 }}>
            Home
          </Button>
          <div style={{ flexGrow: 1 }} />
          {user ? (
            <>
              <IconButton onClick={handleOpenUserMenu}>
                <FontAwesomeIcon icon={faUser} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseUserMenu}>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Stack
              direction="row"
              spacing={2}
              // Pre fetching user auth when user is undefined
              sx={{ display: user === undefined ? 'none' : 'block' }}>
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
