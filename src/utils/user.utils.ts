import { signOut } from "next-auth/react"
import { omit } from 'lodash'

export const handleSignOut = () => {
    localStorage.clear()
    signOut({ redirect: true, callbackUrl: '/' })
}

export const prepareUserForFE = (user: User): Omit<User, 'email'> => {
    return omit(user, ['email'])
}
