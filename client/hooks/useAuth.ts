import { useRefreshTokenMutation, useUpdateUserMutation } from "@/generated/graphql";
import { removeToken, Token, updateToken } from "@/redux/features/token.slice";
import { useRouter } from "next/router";
import { useAppDispatch } from "./useRedux";

const useAuth = () => {
    const router: any = useRouter()
    const dispatch = useAppDispatch()
    const [, getUpdateUser] = useUpdateUserMutation()
    const [, getRefreshToken] = useRefreshTokenMutation()

    const logout = async () => {
        const isDarkMode = localStorage.getItem('isDarkMode');
        localStorage.clear()
        dispatch(removeToken())
        if (isDarkMode) {
            localStorage.setItem('isDarkMode', isDarkMode)
        }
        router.push('/login')
    }

    const updateUser = async (newSettings: Partial<Token>) => {
        await getUpdateUser(newSettings)
        const result = await getRefreshToken({
            refreshToken: localStorage.getItem('refreshToken') as string,
        })

        if (result.data?.refreshToken) {
            localStorage.setItem('token', result.data.refreshToken.token)
            localStorage.setItem('refreshToken', result.data.refreshToken.refreshToken)
            localStorage.setItem('payload', JSON.stringify(result.data.refreshToken.payload))
            dispatch(updateToken())
        }
    }

    return {
        logout,
        updateUser,
        reloadToken: () => dispatch(updateToken()),
    }
}

export default useAuth;