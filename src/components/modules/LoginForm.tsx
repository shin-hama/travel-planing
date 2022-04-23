import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Icon from '@mui/material/SvgIcon'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useForm } from 'react-hook-form'

import { useAuthentication } from 'hooks/firebase/useAuthentication'
import GoogleIcon from 'icons/google.svg'
import { useAsyncFn } from 'react-use'
import AsyncButton from 'components/elements/AsyncButton'
import { useRouter } from 'hooks/useRouter'

type LoginFormInput = {
  email: string
  password: string
}

type Props = {
  isSignUp?: boolean
}
const LoginForm: React.FC<Props> = ({ isSignUp = false }) => {
  const [, auth] = useAuthentication()
  const { register, handleSubmit, reset } = useForm<LoginFormInput>()
  const [user] = useAuthentication()
  const router = useRouter()

  const [handlerState, handleLogin] = useAsyncFn(
    async (values: LoginFormInput) => {
      if (isSignUp) {
        await auth.create(values.email, values.password)
      } else {
        await auth.signIn(values.email, values.password)
      }
      reset()
    },
    [auth, isSignUp, reset]
  )

  React.useEffect(() => {
    if (user) {
      router.userHome()
    }
  }, [user, router])

  return (
    <Box sx={{ maxWidth: '400px', mx: 'auto' }}>
      <Stack alignItems="stretch" spacing={2}>
        <Typography textAlign="center" component="h2" variant="h5">
          {isSignUp ? 'Sign Up Your Account' : 'Login'}
        </Typography>
        <Button
          id="sign-in-with-google"
          variant="outlined"
          color="primary"
          onClick={auth.signInWithGoogle}>
          <Icon fontSize="small" sx={{ mr: 2 }}>
            <GoogleIcon />
          </Icon>
          Continue with Google
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
            <AsyncButton
              loading={handlerState.loading}
              fullWidth
              type="submit"
              variant="contained">
              {isSignUp ? 'アカウントを作成' : 'Login'}
            </AsyncButton>
          </Stack>
        </form>
      </Stack>
    </Box>
  )
}

export default LoginForm
