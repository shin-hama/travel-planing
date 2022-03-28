import * as React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

import Header from 'components/modules/Header'
import LoginForm from 'components/modules/LoginForm'

const Login = () => {
  return (
    <>
      <Header />
      <Stack alignItems="center" spacing={4} sx={{ my: 4, width: '100%' }}>
        <LoginForm isSignUp />
        <Typography>
          登録済みの方は<Link href="login">こちら</Link>
        </Typography>
      </Stack>
    </>
  )
}

export default Login
