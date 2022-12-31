import useTranslation from "next-translate/useTranslation"
import { Fragment, useState } from "react"
import styled from "styled-components"
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Header from "@/components/Header/Header"
import MeasurementsDialogUpdateWeight from "@/containers/measurements/MeasurementsDialogUpdateWeight/MeasurementsDialogUpdateWeight"
import moment from 'moment'
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";

const Content = styled.div`
    width: 100%;
    margin: 0 auto;
    max-width: 702px;
    display: grid;
    grid-template-rows: auto auto 1fr;
    min-height: calc(100vh - var(--BothNavHeightAndPadding));
`

const Description = styled.div`
    font-size: 0.9rem;
    margin: auto 0;
`

const MeasurementsPage = () => {
    const { t } = useTranslation('home')
    const [updateMeasurements, setUpdateMeasurements] = useState<null | Measurement>(null)

    const { data: sessionData } = useSession()

    const username = sessionData?.user?.username || ''

    const {
        data: measurements = [],
    } = trpc
        .measurement
        .getAll
        .useQuery({ username }, { enabled: !!username })

    return (
        <Content>
            <Header text={t('home:ADD_WEIGHT')} />
            <Description>
                {t('Add weight description')}
            </Description>
            <Fragment>
                <Timeline position="alternate">
                    {measurements.map(measurement =>
                        <TimelineItem key={measurement.id}>
                            <TimelineOppositeContent
                                color="text.secondary"
                                onClick={() => setUpdateMeasurements(measurement)}
                            >
                                {moment(measurement.whenAdded).format('DD.MM.YYYY HH:MM')}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent
                                style={{ fontWeight: 'bold' }}
                                onClick={() => setUpdateMeasurements(measurement)}
                            >
                                {Math.round(Number(measurement.weight) * 10) / 10}kg
                            </TimelineContent>
                        </TimelineItem>
                    )}
                </Timeline>
            </Fragment>
            <MeasurementsDialogUpdateWeight
                measurement={updateMeasurements}
                onClose={() => setUpdateMeasurements(null)}
            />
        </Content>
    )
}

export default MeasurementsPage