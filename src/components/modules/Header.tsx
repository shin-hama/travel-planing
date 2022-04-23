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
import Link from 'next/link'

import { useAuthentication } from 'hooks/firebase/useAuthentication'
import { useRouter } from 'hooks/useRouter'

const Header: React.FC = () => {
  const router = useRouter()

  const [user, auth] = useAuthentication()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await auth.signOut()
    handleCloseUserMenu()
    router.push('/')
  }

  return (
    <>
      <AppBar color="inherit">
        <Toolbar variant="dense">
          <Link href={router.home} passHref>
            <Typography
              component="h2"
              variant="h5"
              fontFamily={"'M PLUS Rounded 1c'"}
              fontWeight={800}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                },
              }}>
              旅づくり
            </Typography>
          </Link>
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
                variant="text"
                color="secondary"
                onClick={() => router.push('login')}
                sx={{ display: ['none', 'inline-flex'] }}>
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
