import * as React from 'react'
import { User } from 'firebase/auth'

export const UserAuthorizationContext = React.createContext<
  User | null | undefined
>(undefined)
export const SetUserAuthorizationContext = React.createContext<
  React.Dispatch<React.SetStateAction<User | null | undefined>>
>(() => {
  throw new Error('UserAuthorizationProvider is not wrapped')
})
const UserAuthorizationProvider: React.FC = ({ children }) => {
  // アクセス直後は Undefined だが、Firebase への接続が完了した段階で、User か null がセットされる
  const [user, setUser] = React.useState<User | null>()

  return (
    <UserAuthorizationContext.Provider value={user}>
      <SetUserAuthorizationContext.Provider value={setUser}>
        {children}
      </SetUserAuthorizationContext.Provider>
    </UserAuthorizationContext.Provider>
  )
}

export default UserAuthorizationProvider
