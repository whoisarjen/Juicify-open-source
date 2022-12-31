import styled from "styled-components";

const HeaderText = styled.div`
    font-size: 2rem;
    margin-bottom: 10px;
    font-weight: bold;
    margin: auto 0;
`

const Header = ({ text }: { text: string }) => <HeaderText>{text}</HeaderText>

export default Header;