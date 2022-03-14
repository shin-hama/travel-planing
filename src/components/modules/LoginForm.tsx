import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import Icon from '@mui/material/SvgIcon'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useAuthentication } from 'hooks/firebase/useAuthentication'
import { ReactComponent as GoogleIcon } from 'icons/google.svg'
type Props = {
  open: boolean
  isSignUp: boolean
  onClose: () => void
}
const LoginForm: React.FC<Props> = ({ open, isSignUp, onClose }) => {
  const [, auth] = useAuthentication()

  const [forms, setForms] = React.useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSignUp) {
      await auth.create(forms.email, forms.password)
    } else {
      await auth.signIn(forms.email, forms.password)
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Box sx={{ maxWidth: '400px', mx: 'auto' }}>
          <Stack alignItems="stretch" spacing={2}>
            <Typography textAlign="center" component="h2" variant="h5">
              {isSignUp ? 'Sign Up Your Account' : 'Login'}
            </Typography>
            <Button
              id="sign-in-with-google"
              variant="outlined"
              onClick={auth.signInWithGoogle}>
              <Icon fontSize="small" sx={{ mr: 2 }}>
                <GoogleIcon />
              </Icon>
              Login with Google
            </Button>
            <Divider variant="middle" sx={{ width: '100%' }}>
              or
            </Divider>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="E-mail"
                  name="email"
                  variant="outlined"
                  size="small"
                  type="email"
                  onChange={(e) =>
                    setForms((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  variant="outlined"
                  size="small"
                  type="password"
                  onChange={(e) =>
                    setForms((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
                <Button type="submit" variant="contained">
                  Login
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default LoginForm
