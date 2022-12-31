import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styled from "styled-components";
import { useTheme } from '@/hooks/useTheme';

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
}

const DiagramCircular = ({
    text,
    value,
}: DiagramCircularProps) => {
    const { getTheme } = useTheme()

    const styles = buildStyles({
        pathTransitionDuration: 0.5,
        pathColor: getTheme('PRIMARY'),
        textColor: 'rgba(122, 122, 122, 1',
        trailColor: '#d6d6d6',
        backgroundColor: getTheme('PRIMARY'),
    })

    return (
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
}

export default DiagramCircular;