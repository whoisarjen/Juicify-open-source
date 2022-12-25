import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styled from 'styled-components'

const Box = styled.div`
    width: 100%;
    min-height: calc(calc(100vh - var(--BothNavHeightAndPadding) + 24px));
`

const Home = () => {
    const router = useRouter()

    useEffect(() => {
        router?.push?.('/login')
    })

    return (
        <Box>
            Coming soon.
        </Box>
    );
}

export default Home;