import { useEffect } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react";

const Me = () => {
    const { data: sessionData } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (sessionData?.user?.username) {
            router.push('/coach')
        }
    }, [router, sessionData?.user?.username])

    return null
}

export default Me