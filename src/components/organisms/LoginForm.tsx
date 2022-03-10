import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useAuthentication } from 'hooks/useAuthentication'

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
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Stack alignItems="center" justifyContent="center" spacing={2}>
          <Typography textAlign={'center'} component="h2" variant="h5">
            {isSignUp ? 'Sign Up Your Account' : 'Login'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
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
      </DialogContent>
    </Dialog>
  )
}

export default LoginForm
