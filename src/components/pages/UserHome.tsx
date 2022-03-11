import * as React from 'react'
import Container from '@mui/material/Container'
import Fab from '@mui/material/Fab'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

import PlansList from 'components/modules/PlansList'
import { useAuthentication } from 'hooks/firebase/useAuthentication'
import Header from 'components/modules/Header'

const UserHome = () => {
  const [user] = useAuthentication()

  React.useEffect(() => {
    if (user) {
      console.log(`Hello ${user.displayName}`)
    } else {
      console.log('hello guest')
    }
  }, [user])

  return (
    <>
      <Header />
      <div style={{ height: '100px', backgroundColor: '#aaaaaa50' }}>
        <h2>Next trip</h2>
      </div>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <PlansList />
      </Container>
      <Fab
        color="primary"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}>
        <FontAwesomeIcon icon={faAdd} size="lg" />
      </Fab>
    </>
  )
}

export default UserHome
