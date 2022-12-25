import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styled from "styled-components";

const Grid = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
`

const CircularBox = styled.div`
    max-width: 110px;
    max-height: 110px;
    margin: auto;
    ${this} .CircularProgressbar-text {
        dominant-baseline: middle !important;
        text-anchor: middle !important;
        font-size: 15px !important;
    }
`

interface DiagramCircularProps {
    text: string
    value: number
    styles: any
}

const DiagramCircular = ({
    text,
    value,
    styles,
}: DiagramCircularProps) => (
    <Grid>
        <CircularBox>
            <CircularProgressbar
                value={value}
                text={text}
                styles={styles}
            />
        </CircularBox>
    </Grid>
)

export default DiagramCircular;