import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import useTranslation from 'next-translate/useTranslation';
import { useTheme } from '../hooks/useTheme';
import styled from 'styled-components'
import { sumMacroFromConsumed, getExpectedMacro } from '@/utils/consumed.utils';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import useDaily from '@/hooks/useDaily'

const Box = styled.aside`
    padding: 12px;
    @media (max-width: 1105px) {
        display: none;
    }
`

const CircularBox = styled.aside`
    padding: 6px;
    display: grid;
    grid-template-columns: 80px auto;
    height: 80px;
    ${this} div {
        margin: auto 12px;
    }
    ${this} .CircularProgressbar-text {
        dominant-baseline: middle !important;
        text-anchor: middle !important;
        font-size: 15px !important;
    }
`

const whenAdded = moment().format('YYYY-MM-DD')

const SidebarRight = () => {
    const { t } = useTranslation('home')
    const { data: sessionData } = useSession()
    const { getTheme } = useTheme()

    const {
        consumedMacro,
        expectedMacro,
        burnedCalories,
        workoutResults,
    } = useDaily(whenAdded)

    const styles = buildStyles({
        textSize: '15px',
        pathTransitionDuration: 0.5,
        pathColor: getTheme('PRIMARY'),
        textColor: 'rgba(122, 122, 122, 1',
        trailColor: '#d6d6d6',
        backgroundColor: getTheme('PRIMARY')
    })

    const weight = 0 // TODO
    const username = sessionData?.user?.username
    const coach = moment(whenAdded).diff(sessionData?.user?.nextCoach, 'days')

    const CIRCULAR_BOX_VALUES = [
        {
            href: '/measurements',
            value: weight ? 100 : 0,
            text: `${weight}kg`,
            label: t('Weight'),
        },
        {
            href: `/${username}/consumed/${whenAdded}`,
            value: (consumedMacro.calories - burnedCalories) / expectedMacro.calories * 100,
            text: `${(consumedMacro.calories - burnedCalories)}Kcal`,
            label: t('Calories'),
        },
        {
            href: `/${username}/workout/results/`,
            value: workoutResults.length * 100,
            text: workoutResults.length.toString(),
            label: t('Workout'),
        },
        {
            href: `/coach`,
            value: (7 - coach) / 7 * 100,
            text: `${coach >= 0 ? coach : 0}days`,
            label: t('Coach'),
        },
    ]

    return (
        <Box>
            <List
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper'
                }}
                subheader={
                    <ListSubheader component='div' id='nested-list-subheader'>
                        {t('Data for')} {moment(whenAdded).format('DD.MM.YYYY')}:
                    </ListSubheader>
                }
            >
                {CIRCULAR_BOX_VALUES.map(({ href, text, value, label }) =>
                    <Link href={href} key={text}>
                        <ListItemButton>
                            <CircularBox>
                                <CircularProgressbar
                                    value={value}
                                    text={text}
                                    styles={styles}
                                />
                                <div>{label}</div>
                            </CircularBox>
                        </ListItemButton>
                    </Link>
                )}
            </List>
        </Box>
    )
}

export default SidebarRight;