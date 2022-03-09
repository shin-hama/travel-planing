import * as React from 'react'
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth'

import { auth } from 'configs'

export const useAuthentication = () => {
  const [user, setUser] = React.useState<UserCredential | null>(null)
  const createUser = React.useCallback(
    async (email: string, password: string) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )

        console.log(userCredential)
        setUser(userCredential)
      } catch (e) {
        console.error(e)
      }
    },
    []
  )

  return [user, { create: createUser }] as const
}
