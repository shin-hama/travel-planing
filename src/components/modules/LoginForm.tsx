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
import { useForm } from 'react-hook-form'

import { useAuthentication } from 'hooks/firebase/useAuthentication'
import GoogleIcon from 'icons/google.svg'

type LoginFormInput = {
  email: string
  password: string
}

type Props = {
  open: boolean
  isSignUp: boolean
  onClose: () => void
}
const LoginForm: React.FC<Props> = ({ open, isSignUp, onClose }) => {
  const [, auth] = useAuthentication()
  const { register, handleSubmit, reset } = useForm<LoginFormInput>()

  const handleLogin = async (values: LoginFormInput) => {
    if (isSignUp) {
      await auth.create(values.email, values.password)
    } else {
      await auth.signIn(values.email, values.password)
    }
    reset()
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
            <form onSubmit={handleSubmit(handleLogin)}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  {...register('email')}
                  label="E-mail"
                  variant="outlined"
                  size="small"
                  type="email"
                />
                <TextField
                  fullWidth
                  {...register('password')}
                  label="Password"
                  variant="outlined"
                  size="small"
                  type="password"
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
