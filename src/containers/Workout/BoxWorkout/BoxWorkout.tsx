import styled from 'styled-components'
import { useTheme } from "../../../hooks/useTheme";
import useTranslation from 'next-translate/useTranslation';
import { ReactNode } from 'react';
import moment from 'moment';
import Link from 'next/link';

const Grid = styled.div`
    min-height: 140px;
    width: calc(100% - 20px);
    padding: 10px;
    margin-top: 12px;
    border-radius: 8px;
    cursor: pointer;
    color: #fff;
    background: #1976d2;
    box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%),
        0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
    display: grid;
    grid-template-columns: auto 100px;
`

const Text = styled.div`
    margin-left: 10px;
    margin-block-end: 0.83em;
    ${this} h2 {
        margin-block-end: 0.415em;
    }
`

const Icon = styled.div`
    margin: auto;
    grid-column: 2;
    grid-row: 1 / 3;
    ${this} svg {
        font-size: 2rem;
    }
`

const NotSavedText = styled.div`
    margin: auto;
    margin-left: 10px;
`

interface BoxWorkoutProps {
    title?: string,
    description?: string,
    route: string,
    icon: ReactNode,
    isNotSaved?: boolean,
    whenAdded?: Date
}

const BoxWorkout = ({ title, description, route, icon, isNotSaved, whenAdded }: BoxWorkoutProps) => {
    const { t } = useTranslation('workout');
    const { getTheme } = useTheme()

    return (
        <Link href={route}>
            <Grid style={{ background: isNotSaved ? 'red' : getTheme('PRIMARY') }}>
                
                <Text>
                    <h2>{title}</h2>
                    <div>{description}</div>
                </Text>

                <Icon>{icon}</Icon>

                {whenAdded && <NotSavedText>{moment(whenAdded).format('DD.MM.YYYY')}</NotSavedText>}
                
                {isNotSaved && <NotSavedText>{t('Notsaved')}</NotSavedText>}
            </Grid>
        </Link>
    )
}

export default BoxWorkout;