import { useEffect } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react";
import moment from 'moment'

const Me = () => {
    const { data: sessionData } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (sessionData?.user?.username) {
            router.push(`/${sessionData?.user?.username}/consumed/${moment().format('YYYY-MM-DD')}`)
        }
    }, [router, sessionData?.user?.username])

    return null
}

export default Me