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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      console.log(userCredential)
    },
    []
  )

  const signIn = React.useCallback(async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    console.log(userCredential)
  }, [])

  const signOut = React.useCallback(() => {
    auth.signOut()
  }, [])

  return [user, { create: createUser, signIn, signOut }] as const
}
