import * as React from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useAuthentication } from 'hooks/useAuth'

const LoginForm = () => {
  const [forms, setForms] = React.useState({
    email: '',
    password: '',
  })
  const [user, auth] = useAuthentication()

  React.useEffect(() => {
    console.log(user)
  }, [user])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e)
    e.preventDefault()
    auth.signIn(forms.email, forms.password)
  }
  return (
    <Stack alignItems="center" justifyContent="center">
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography textAlign={'center'} component="h2" variant="h5">
              Login
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
                    setForms((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
                <Button type="submit" variant="contained">
                  Login
                </Button>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default LoginForm
