import * as React from 'react'

import Layout from 'components/layouts/Layout'
import { useRouter } from 'hooks/useRouter'
import { useAuthentication } from 'hooks/firebase/useAuthentication'

const Home = () => {
  const [user] = useAuthentication()
  const router = useRouter()

  React.useEffect(() => {
    if (user) {
      router.userHome(true)
    } else {
      router.push('signup')
    }
  }, [user, router])

  return <Layout title="Home"></Layout>
}

export default Home
