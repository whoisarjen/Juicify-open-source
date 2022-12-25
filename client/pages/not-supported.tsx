import useTranslation from 'next-translate/useTranslation'
import styled from 'styled-components'

const Box = styled.div`
    height: 100%;
    width: 100%;
    display: grid;
    margin: auto;
`

const Content = styled.div`
    margin: auto;
    text-align: center;
`

const NotSupported = () => {
    const { t } = useTranslation('error')

    return (
        <Box>
            <Content>
                <h1>{t('WE_GOT_A_PROBLEM')}</h1>
                <h2>{t('WE_GOT_A_PROBLEM_DESCRIPTION')}</h2>
            </Content>
        </Box>
    )
}

export default NotSupported;