import * as React from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth'

import { auth } from 'configs'

export const useAuthentication = () => {
  // アクセス直後は Undefined だが、Firebase への接続が完了した段階で、User か null がセットされる
  const [user, setUser] = React.useState<User | null>()

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

      return userCredential
    },
    []
  )

  const signIn = React.useCallback(async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return userCredential
  }, [])

  const signOut = React.useCallback(async () => {
    await auth.signOut()
  }, [])

  return [user, { create: createUser, signIn, signOut }] as const
}
