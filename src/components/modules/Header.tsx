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
import { useRouter } from 'next/router'

import { useAuthentication } from 'hooks/firebase/useAuthentication'

const Header = () => {
  const router = useRouter()

  const [user, auth] = useAuthentication()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    router.push('/')
    auth.signOut()
    handleCloseUserMenu()
  }

  return (
    <>
      <AppBar color="inherit">
        <Toolbar variant="dense">
          <Button
            color="inherit"
            onClick={() => router.push('/home')}
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
                onClick={() => router.push('login')}>
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/signup')}>
                Sign Up
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar variant="dense" />
    </>
  )
}

export default Header
