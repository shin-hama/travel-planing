import * as React from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useAuthentication } from 'hooks/useAuth'

const LoginForm = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [user, auth] = useAuthentication()

  React.useEffect(() => {
    console.log(user)
  }, [user])

  const handleClick = () => {
    auth.create(email, password)
  }
  return (
    <Stack alignItems="center" justifyContent="center">
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography textAlign={'center'} component="h2" variant="h5">
              Login
            </Typography>
            <TextField
              label="E-mail"
              variant="outlined"
              size="small"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              size="small"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" onClick={handleClick}>
              Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default LoginForm
