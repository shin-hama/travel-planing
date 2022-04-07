import * as React from 'react'
import { useRouter as useNextRouter } from 'next/router'
import { useAuthentication } from './firebase/useAuthentication'

export const useRouter = () => {
  const [user] = useAuthentication()
  const nextRouter = useNextRouter()

  const router = React.useMemo(() => {
    const myRouter = {
      ...nextRouter,
      userHome: (replace = false) => {
        if (user) {
          if (replace) {
            nextRouter.replace(`/${user.uid}`)
          } else {
            nextRouter.push(`/${user.uid}`)
          }
        }
      },
      userPlan: (planId: string) => {
        if (user) {
          nextRouter.push(`/${user.uid}/${planId}`)
        }
      },
      home: `/${user?.uid || ''}`,
    }
    return myRouter
  }, [nextRouter, user])

  return router
}
