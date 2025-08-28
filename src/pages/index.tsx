import {
    type ClientSafeProvider,
    getProviders,
    LiteralUnion,
    useSession,
} from 'next-auth/react'
import LandingPage from '@/components/LandingPage'
import { useEffect, useState } from 'react'
import { type BuiltInProviderType } from 'next-auth/providers'

const Home = () => {
    const { data: sessionData } = useSession()
    const [providers, setProviders] = useState<Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    > | null>(null)

    useEffect(() => {
        (async () => {
            setProviders(await getProviders())
        })()
    }, [setProviders])

    useEffect(() => {
        if (sessionData) {
            window.location.reload()
        }
    }, [sessionData])

    return <LandingPage providers={providers} />
}

export default Home
