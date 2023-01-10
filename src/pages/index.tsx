import { type ClientSafeProvider, getProviders, LiteralUnion, signIn } from 'next-auth/react';
import styled from 'styled-components'
import Logo from '@/components/Logo/Logo';
import { useEffect, useState } from 'react'
import { type BuiltInProviderType } from 'next-auth/providers';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

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

    useEffect(() => {
        (async () => {
            setProviders(await getProviders())
        })()
    }, [setProviders])

    return (
        <Main>
            <div>
                <Logo size={175} />
            </div>
            <div>
                <Stack spacing={2} direction="column">
                    {providers && Object.values(providers).map((provider) => (
                        <Button
                            variant="outlined"
                            key={provider.name}
                            onClick={() => signIn(provider.id, { callbackUrl: '/me' })}
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