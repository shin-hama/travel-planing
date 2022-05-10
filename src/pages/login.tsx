import * as React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

import Layout from 'components/layouts/Layout'
import LoginForm from 'components/modules/LoginForm'

const Login = () => {
  return (
    <Layout title="Login">
      <Stack alignItems="center" spacing={4} sx={{ my: 4, width: '100%' }}>
        <LoginForm />
        <Typography>
          登録がまだの方は<Link href="signup">こちら</Link>
        </Typography>
      </Stack>
    </Layout>
  )
}

export default Login
