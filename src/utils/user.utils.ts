import { type Session } from "next-auth"

const PERMISSION_ADMIN = 'Administration'

type PermissionName = typeof PERMISSION_ADMIN

export const DASHBOARD_PATH = '/dashboard'

export const PROTECTED_PATHS_REQUIRED_PERMISSIONS = {
    [DASHBOARD_PATH]: [PERMISSION_ADMIN],
}

const hasPermission = (sessionData: Session | null, permissionNames: PermissionName[]) =>
    sessionData?.user?.permissions?.some(permission => permissionNames.some(permissionName => permissionName === permission.name))

export const hasPermissionToPath = (sessionData: Session | null, path: keyof typeof PROTECTED_PATHS_REQUIRED_PERMISSIONS) => {
    const nameOfPermissions = PROTECTED_PATHS_REQUIRED_PERMISSIONS[path] as PermissionName[]
    return hasPermission(sessionData, nameOfPermissions)
}
