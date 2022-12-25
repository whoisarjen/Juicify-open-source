import { MeasurementFieldsFragment, useMeasurementsByRangeAndUsernameQuery } from "@/generated/graphql"
import useTranslation from "next-translate/useTranslation"
import { Fragment, useEffect, useMemo, useState } from "react"
import styled from "styled-components"
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { useAppSelector } from "@/hooks/useRedux"
import Header from "@/components/Header/Header"
import MeasurementsDialogUpdateWeight from "@/containers/measurements/MeasurementsDialogUpdateWeight/MeasurementsDialogUpdateWeight"
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';

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
    const [loadedDays, setLoadedDays] = useState(14)
    const [updateMeasurements, setUpdateMeasurements] = useState<null | MeasurementFieldsFragment>(null)

    const token = useAppSelector(state => state.token)
    const [{ data, fetching }, getMeasurementsByRangeAndUsername] = useMeasurementsByRangeAndUsernameQuery({
        variables: {
            startDate: moment().add(-loadedDays, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            username: token?.username as string,
        },
        pause: true,
    })

    useEffect(() => {
        if (token?.username) {
            getMeasurementsByRangeAndUsername()
        }
    }, [token?.username])

    const measurements = useMemo(() => {
        return [...Array(loadedDays)].map((x, i) => {
            const when = moment().add(-i, 'd').format('YYYY-MM-DD')
            const foundMeasurement = data?.measurementsByRangeAndUsername
                ?.find(measurement => measurement && measurement.when == when)

            return foundMeasurement || {
                id: uuidv4(),
                weight: 0,
                when,
                isFake: true,
            } as MeasurementFieldsFragment & { isFake?: boolean }
        })
    }, [data?.measurementsByRangeAndUsername, fetching])

    return (
        <Content>
            <Header text={t('home:ADD_WEIGHT')} />
            <Description>
                {t('Add weight description')}
            </Description>
            <Fragment>
                <Timeline position="alternate">
                    {measurements.map(measurement =>
                        measurement &&
                        <TimelineItem key={measurement.id}>
                            <TimelineOppositeContent
                                color="text.secondary"
                                onClick={() => setUpdateMeasurements(measurement)}
                            >
                                {moment(measurement.when).format('DD.MM.YYYY')}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            {measurement.weight > 0
                                ? <TimelineContent
                                    style={{ fontWeight: 'bold' }}
                                    onClick={() => setUpdateMeasurements(measurement)}
                                >
                                    {Math.round(measurement.weight * 10) / 10}kg
                                </TimelineContent>
                                : <TimelineContent
                                    color="error"
                                    style={{ fontWeight: 'bold' }}
                                    onClick={() => setUpdateMeasurements(measurement)}
                                >
                                    {Math.round(measurement.weight * 10) / 10}kg
                                </TimelineContent>
                            }
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