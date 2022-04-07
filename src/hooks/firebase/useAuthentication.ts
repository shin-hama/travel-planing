import * as React from 'react'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'

import { auth } from 'configs'
import {
  UserAuthorizationContext,
  SetUserAuthorizationContext,
} from 'contexts/UserAuthorizationProvider'

auth.useDeviceLanguage()

const google = new GoogleAuthProvider()

export const useAuthentication = () => {
  // アクセス直後は Undefined だが、Firebase への接続が完了した段階で、User か null がセットされる
  const user = React.useContext(UserAuthorizationContext)
  const setUser = React.useContext(SetUserAuthorizationContext)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userInfo) => {
      setUser(userInfo)
    })

    return () => {
      unsubscribe()
    }
  }, [setUser])

  const actions = React.useMemo(() => {
    const a = {
      create: async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )

        return userCredential
      },
      signIn: async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        )
        return userCredential
      },
      signInWithGoogle: async () => {
        try {
          // const result = await signInWithPopup(auth, google)
          const result = await signInWithPopup(auth, google)
          // You can use these server side with your app's credentials to access the Twitter API.
          const credential = GoogleAuthProvider.credentialFromResult(result)
          return credential
        } catch (e) {
          // Handle Errors here.
          console.error(e)
          throw e
        }
      },
      signOut: async () => await auth.signOut(),
    }
    return a
  }, [])

  return [user, actions] as const
}
