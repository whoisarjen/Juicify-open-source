import { signIn } from 'next-auth/react';
import styled from 'styled-components'
import Button from '@mui/material/Button';
import Logo from '@/components/Logo/Logo';
import useTranslation from 'next-translate/useTranslation';

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
    const { t } = useTranslation('home')

    return (
        <Main>
            {/* TODO buttons directly from providers and only logo */}
            <div>
                <Logo size={175} />
            </div>
            <div>
                <Button
                    size='large'
                    variant="contained"
                    onClick={() => signIn()}
                >{t('LOGIN')}</Button>
            </div>
        </Main>
    );
}

export default Home;