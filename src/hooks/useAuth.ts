import * as React from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth'

import { auth } from 'configs'

export const useAuthentication = () => {
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    onAuthStateChanged(auth, (userInfo) => {
      setUser(userInfo)
    })
  }, [])

  const createUser = React.useCallback(
    async (email: string, password: string) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )

        console.log(userCredential)
      } catch (e) {
        console.error(e)
      }
    },
    []
  )

  const signIn = React.useCallback(async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      console.log(userCredential)
    } catch (e) {
      console.error(e)
    }
  }, [])

  return [user, { create: createUser, signIn }] as const
}
