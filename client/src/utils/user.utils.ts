import { type Session } from "next-auth"
import { signOut } from "next-auth/react"

const PERMISSION_ADMIN = 'Administration'

export const DASHBOARD_PATH = '/dashboard'

export const PROTECTED_PATHS_REQUIRED_PERMISSIONS = {
    [DASHBOARD_PATH]: [PERMISSION_ADMIN],
}

export const hasPermissionToPath = (sessionData: Session | null, path: string) => {
    const expectedPermissions = PROTECTED_PATHS_REQUIRED_PERMISSIONS[path as keyof typeof PROTECTED_PATHS_REQUIRED_PERMISSIONS]

    if (!expectedPermissions || !expectedPermissions.length) {
        return true
    }

    return sessionData?.user?.permissions?.some(({ name }) => expectedPermissions.some((permissionName) => permissionName === name))
}

export const handleSignOut = () => {
    localStorage.clear()
    signOut()
}
