import styled from "styled-components";

const Grid = styled.div`
    text-align: center;
    width: 100%;
    height: 100%;
    display: grid;
`

const Box = styled.div`
    width: 100%;
    margin: auto;
`

const Offline = () => {
    return (
        <Grid>
            <Box>
                <h1>OFFLINE</h1>
            </Box>
        </Grid>
    );
}

export default Offline;