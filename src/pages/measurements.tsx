import useTranslation from "next-translate/useTranslation"
import { useState } from "react"
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import moment from 'moment'
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc.utils";
import { DialogMeasurement } from '@/containers/DialogMeasurement'
import NavbarOnlyTitle from "@/components/NavbarOnlyTitle/NavbarOnlyTitle";

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
        <div className="flex flex-col gap-4 flex-1">
            <NavbarOnlyTitle title="home:ADD_WEIGHT" />
            <div>
                {t('Add weight description')}
            </div>
            <DialogMeasurement
                measurement={selectedMeasurement}
                defaultWeight={Number(measurements[0]?.weight)}
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
        </div>
    )
}

export default MeasurementsPage