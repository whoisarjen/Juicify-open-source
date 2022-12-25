import styled from 'styled-components'

const Box = styled.aside`
    padding: 12px;
    @media (max-width: 1105px) {
        display: none;
    }
`

const SidebarRightLoggouted = () => {
    return (
        <Box />
    )
}

export default SidebarRightLoggouted;