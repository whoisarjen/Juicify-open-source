import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";

const Title = styled.div`
    font-size: 2rem;
    margin-bottom: 10px;
    font-weight: bold;
    margin: auto 0;
`

const NavbarOnlyTitle = ({ title }: { title: string }) => {
    const { t } = useTranslation()

    return <Title>{t(title)}</Title>
}

export default NavbarOnlyTitle;