import * as React from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from 'configs'

export const UserAuthorizationContext = React.createContext<
  User | null | undefined
>(undefined)

const UserAuthorizationProvider: React.FC = ({ children }) => {
  // アクセス直後は Undefined だが、Firebase への接続が完了した段階で、User か null がセットされる
  const [user, setUser] = React.useState<User | null>()

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userInfo) => {
      setUser(userInfo)
    })

    return () => {
      unsubscribe()
    }
  }, [setUser])

  if (user === undefined) {
    return <></>
  }

  return (
    <UserAuthorizationContext.Provider value={user}>
      {children}
    </UserAuthorizationContext.Provider>
  )
}

export default UserAuthorizationProvider
