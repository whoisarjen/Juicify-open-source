import useTranslation from "next-translate/useTranslation"
import { useState } from "react"
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
import { DialogMeasurement } from '@/containers/DialogMeasurement'

const Content = styled.div`
    width: 100%;
    margin: 0 auto;
    max-width: 702px;
    display: grid;
    grid-template-rows: auto auto auto 1fr;
    min-height: calc(100vh - var(--BothNavHeightAndPadding));
`

const Description = styled.div`
    font-size: 0.9rem;
    margin: auto 0;
`

const MeasurementsPage = () => {
    const { t } = useTranslation('home')
    const [selectedMeasurement, setSelectedMeasurement] = useState<null | Measurement>(null)

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
            <DialogMeasurement
                measurement={selectedMeasurement}
                defaultWeight={measurements[0]?.weight}
            />
            <Timeline position="alternate">
                {measurements.map(measurement =>
                    <TimelineItem key={measurement.id}>
                        <TimelineOppositeContent
                            color="text.secondary"
                            onClick={() => setSelectedMeasurement(measurement)}
                        >
                            {moment(measurement.whenAdded).format('DD.MM.YYYY HH:MM')}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent
                            style={{ fontWeight: 'bold' }}
                            onClick={() => setSelectedMeasurement(measurement)}
                        >
                            {Math.round(Number(measurement.weight) * 10) / 10}kg
                        </TimelineContent>
                    </TimelineItem>
                )}
            </Timeline>
            {/* <MeasurementsDialogUpdateWeight
                measurement={selectedMeasurement}
                onClose={() => setSelectedMeasurement(null)}
            /> */}
        </Content>
    )
}

export default MeasurementsPage