import {
    type ClientSafeProvider,
    getProviders,
    LiteralUnion,
    signIn,
    useSession,
} from 'next-auth/react'
import Logo from '@/components/Logo/Logo'
import { useEffect, useState } from 'react'
import { type BuiltInProviderType } from 'next-auth/providers'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

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

    return (
        <div className="flex flex-col items-center justify-around flex-1">
            <Logo size={175} />
            {/* TODO ACCEPT RULES + TRANSLATE WHOLE SITE (NEED TO CHECK WHERE) */}
            <Stack spacing={2} direction="column">
                {providers &&
                    Object.values(providers).map((provider) => (
                        <Button
                            variant="outlined"
                            key={provider.name}
                            onClick={() =>
                                signIn(provider.id, {
                                    callbackUrl: 'http://juicify.app/coach',
                                })
                            }
                        >
                            Sign in with {provider.name}
                        </Button>
                    ))}
            </Stack>
        </div>
    )
}

export default Home
