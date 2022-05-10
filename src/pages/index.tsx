import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Fab from '@mui/material/Fab'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

import Layout from 'components/layouts/Layout'
import { useConfirm } from 'hooks/useConfirm'
import { useRouter } from 'hooks/useRouter'
import { useAuthentication } from 'hooks/firebase/useAuthentication'

const UserHome = () => {
  const [user] = useAuthentication()
  const router = useRouter()
  const confirm = useConfirm()

  React.useEffect(() => {
    if (user) {
      router.userHome(true)
    }
  }, [user, router])

  const handleClick = async () => {
    try {
      await confirm({
        title: 'Create Plan?',
        description:
          'NOTE: You are a guest user, you cannot save plan. Please create account or login if you want to save.',
        allowClose: true,
      })
    } catch {}
    router.push('new')
  }

  return (
    <Layout title="Home">
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Box display="flex" justifyContent="center">
          <Button variant="contained" onClick={handleClick}>
            Plan Your Travel
          </Button>
        </Box>
      </Container>
      <Fab
        onClick={handleClick}
        color="primary"
        sx={{
          position: 'fixed',
          right: 16,
          bottom: 16,
        }}>
        <FontAwesomeIcon icon={faAdd} size="lg" />
      </Fab>
    </Layout>
  )
}

export default UserHome
