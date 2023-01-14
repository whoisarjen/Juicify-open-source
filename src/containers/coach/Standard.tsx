import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import HistoryIcon from '@mui/icons-material/History';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import NavbarOnlyTitle from "@/components/NavbarOnlyTitle/NavbarOnlyTitle"
import moment from 'moment'
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { goals } from "@prisma/client";
import { GOALS } from "@/utils/coach.utils";
import CoachContainer from './CoachContainer'
import CoachButton from "./CoachButton";

interface StandardProps {
    setStep: (step: string) => void
}

const TopButtons = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    ${this} button {
        padding-bottom: 5px;
    }
    ${this} div {
        font-size: 0.75rem;
        text-transform: uppercase;
    }
`

const Seperate = styled.div`
    width: 100%;
    border-bottom: 1px solid #e4e4e4;
    margin: 24.5px 0;
`

const SecondInfo = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
`

const SecondBold = styled.div`
    font-size: 1.1rem;
    font-weight: bold;
`

const Standard = ({ setStep }: StandardProps) => {
    const { t } = useTranslation('coach')
    const [daysToCoach, setDaysToCoach] = useState(7)
    const { data: sessionData } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (sessionData?.user) {
            setDaysToCoach(moment(sessionData?.user?.nextCoach).diff(moment(), 'd'))
        }
    }, [sessionData?.user])

    if (!sessionData?.user) {
        return null
    }

    return (
        <CoachContainer>
            <TopButtons>
                <div onClick={() => setStep('Welcome')}>
                    <IconButton aria-label="reset">
                        <RestartAltIcon color="primary" />
                    </IconButton>
                    <div>{t('NEW_GOAL')}</div>
                </div>
                <div onClick={() => setStep('Tutorial_1')}>
                    <IconButton aria-label="help">
                        <HelpOutlineIcon color="primary" />
                    </IconButton>
                    <div>{t('HELP')}</div>
                </div>
                <div onClick={() => router.push('/measurements')}>
                    <IconButton aria-label="history">
                        <HistoryIcon color="primary" />
                    </IconButton>
                    <div>{t('HISTORY')}</div>
                </div>
            </TopButtons>
            {sessionData.user.goal === goals.ZERO
                ? <NavbarOnlyTitle title="coach:RECOMPOSITION" />
                : !sessionData.user.goal.includes('MINUS')
                    ? <NavbarOnlyTitle title="coach:MUSCLE_BUILDING" />
                    : <NavbarOnlyTitle title="coach:LOSING_WEIGHT" />
            }
            <div>{GOALS[sessionData.user.goal]}% / {t('WEEK')}</div>
            <div>
                {t('STANDARD_DESCRIPTION')}
            </div>
            <Seperate />
            <SecondInfo>
                <div>
                    <div>{t('LAST_CHECK')}</div>
                    <SecondBold>{moment(sessionData.user.nextCoach).add('days', -7).format('DD.MM.YYYY')}</SecondBold>
                </div>
                <div />
                <div>
                    <div>{t('NEXT_CHECK')}</div>
                    <SecondBold>{moment(sessionData.user.nextCoach).format('DD.MM.YYYY')}</SecondBold>
                </div>
            </SecondInfo>
            {daysToCoach > 0 ?
                <>
                    <div>{daysToCoach} {t('DAYS_UNTIL_NEXT')}</div>
                    <CoachButton
                        disabled
                        variant="contained"
                    >
                        {t('STANDARD_BUTTON')}
                    </CoachButton>
                </>
                :
                <>
                    <div>{t('STANDARD_TIME_TO_CHECK_PROGRESS')}</div>
                    <CoachButton
                        color="error"
                        variant="contained"
                        onClick={() => setStep('ChooseAnalyzeSource')}
                    >
                        {t('STANDARD_BUTTON')}
                    </CoachButton>
                </>
            }
        </CoachContainer>
    )
}

export default Standard;