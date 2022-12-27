import { useEffect, useMemo } from "react"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import useTranslation from "next-translate/useTranslation";
import { useTheme } from "../hooks/useTheme";
import styled from 'styled-components'
import { getConsumedMacro, getExpectedMacro } from "@/utils/consumed.utils";
import moment from "moment";
import { useDailyByWhenAndUsernameQuery } from "@/generated/graphql";
import { useSession } from "next-auth/react";
import Link from "next/link";

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

const SidebarRight = () => {
    const { t } = useTranslation('home')
    const { data: sessionData } = useSession()
    const { getTheme } = useTheme()
    const when = new Date().toISOString().slice(0, 10)
    const username = sessionData?.user?.username || ''

    const styles = useMemo(() => buildStyles({
        textSize: '15px',
        pathTransitionDuration: 0.5,
        pathColor: getTheme('PRIMARY'),
        textColor: 'rgba(122, 122, 122, 1',
        trailColor: '#d6d6d6',
        backgroundColor: getTheme('PRIMARY')
    }), [])

    const [{ data, fetching }, getDailyByWhenAndUsername] = useDailyByWhenAndUsernameQuery({
        variables: {
            when,
            username,
        },
        pause: true,
    })

    const { consumedMacro, expectedMacro } = useMemo(() => {
        return {
            consumedMacro: getConsumedMacro(data?.consumedByWhenAndUsername),
            expectedMacro: getExpectedMacro(data?.userByUsername, when),
        }
    }, [data?.consumedByWhenAndUsername, data?.userByUsername, fetching])

    const burnedCalories = useMemo(() => data?.workoutResultsByWhen?.reduce((prev: any, current: any) => prev + (current?.burnedCalories || 0), 0) || 0, [data?.workoutResultsByWhen])

    const coach = moment(moment()).diff(sessionData?.user?.nextCoach, 'days')

    useEffect(() => {
        when && username && getDailyByWhenAndUsername()
    }, [when, username])

    return (
        <Box>
            {styles &&
                <List
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            {t('Data for')} {moment().format('DD.MM.YYYY')}:
                        </ListSubheader>
                    }
                >
                    <Link href="/measurements">
                        <ListItemButton>
                            <CircularBox>
                                <CircularProgressbar
                                    value={data?.measurementByWhenAndUsername?.weight || 0 ? 100 : 0}
                                    text={`${data?.measurementByWhenAndUsername?.weight || 0}kg`}
                                    styles={styles}
                                />
                                <div>
                                    {t("Weight")}
                                </div>
                            </CircularBox>
                        </ListItemButton>
                    </Link>
                    <Link href={`/${sessionData?.user?.username}/consumed/${moment().format('YYYY-MM-DD')}`}>
                        <ListItemButton>
                            <CircularBox>
                                <CircularProgressbar
                                    value={(consumedMacro.calories - burnedCalories) ? (consumedMacro.calories - burnedCalories) / expectedMacro.calories * 100 : 0}
                                    text={`${(consumedMacro.calories - burnedCalories)}Kcal`}
                                    styles={styles}
                                />
                                <div>
                                    {t("Calories")}
                                </div>
                            </CircularBox>
                        </ListItemButton>
                    </Link>
                    <Link href={`/${sessionData?.user?.username}/workout/results/`}>
                        <ListItemButton>
                            <CircularBox>
                                <CircularProgressbar
                                    value={(data?.workoutResultsByWhen?.length || 0) * 100}
                                    text={`${(data?.workoutResultsByWhen?.length || 0)}`}
                                    styles={styles}
                                />
                                <div>
                                    {t("Workout")}
                                </div>
                            </CircularBox>
                        </ListItemButton>
                    </Link>
                    <Link href={`/coach`}>
                        <ListItemButton>
                            <CircularBox>
                                <CircularProgressbar
                                    value={(7 - coach) / 7 * 100}
                                    text={`${coach >= 0 ? coach : 0}days`}
                                    styles={styles}
                                />
                                <div>
                                    {t("Coach")}
                                </div>
                            </CircularBox>
                        </ListItemButton>
                    </Link>
                </List>
            }
        </Box>
    )
}

export default SidebarRight;