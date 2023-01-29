import { type ClientSafeProvider, getProviders, LiteralUnion, signIn, useSession } from 'next-auth/react';
import styled from 'styled-components'
import Logo from '@/components/Logo/Logo';
import { useEffect, useState } from 'react'
import { type BuiltInProviderType } from 'next-auth/providers';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';

const Main = styled.main`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    ${this} > div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`

const Home = () => {
    const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null)
    const { data: sessionData } = useSession()
    const router = useRouter()

    useEffect(() => {
        (async () => {
            setProviders(await getProviders())
        })()
    }, [setProviders])

    useEffect(() => {
        if (sessionData?.user) {
            router.push('/coach')
        }
    }, [router, sessionData?.user])

    return (
        <Main>
            <div>
                <Logo size={175} />
            </div>
            {/* TODO ACCEPT RULES + TRANSLATE WHOLE SITE (NEED TO CHECK WHERE) */}
            <div>
                <Stack spacing={2} direction="column">
                    {providers && Object.values(providers).map((provider) => (
                        <Button
                            variant="outlined"
                            key={provider.name}
                            onClick={() => signIn(provider.id)}
                        >
                            Sign in with {provider.name}
                        </Button>
                    ))}
                </Stack>
            </div>
        </Main>
    );
}

export default Home;