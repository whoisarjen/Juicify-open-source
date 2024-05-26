import { signOut } from "next-auth/react"

export const handleSignOut = () => {
    localStorage.clear()
    signOut()
}
