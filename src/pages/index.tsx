import { signIn } from 'next-auth/react';
import styled from 'styled-components'

const Main = styled.main`
    width: 100%;
    min-height: calc(calc(100vh - var(--BothNavHeightAndPadding) + 24px));
`

const Home = () => {
    return (
        <Main>
            Coming soon.
            <button onClick={() => signIn()}>Sign in</button>
        </Main>
    );
}

export default Home;