import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListSubheader from '@mui/material/ListSubheader'
import useTranslation from 'next-translate/useTranslation'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import useDaily from '@/hooks/useDaily'
import { trpc } from '@/utils/trpc.utils'
import { LastJoinedUsersList, SidebarRightBlogList } from '@/components/LastJoinedUsersList'
import { useRouter } from 'next/router'

const whenAdded = moment().format('YYYY-MM-DD')

const SidebarRight = () => {
    const { t } = useTranslation('home')
    const { data: sessionData } = useSession()

    const username = sessionData?.user?.username || ''

    const { consumedMacro, expectedMacro, workoutResults, burnedCaloriesSum } =
        useDaily({ username, startDate: whenAdded, endDate: whenAdded })

    const { data: measurement } = trpc.measurement.getDay.useQuery(
        { username, whenAdded },
        { enabled: !!username && !!whenAdded }
    )

    const weight = measurement?.weight || 0
    const coach = moment(sessionData?.user?.nextCoach).diff(whenAdded, 'days')

    const CIRCULAR_BOXES = [
        {
            href: '/measurements',
            value: weight ? 100 : 0,
            text: `${weight}kg`,
            label: t('Weight'),
        },
        {
            href: `/${username}/consumed/${whenAdded}`,
            value:
                ((consumedMacro.calories - burnedCaloriesSum) /
                    expectedMacro.calories) *
                100,
            text: `${consumedMacro.calories - burnedCaloriesSum}Kcal`,
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
            value: ((7 - coach) / 7) * 100,
            text: `${coach >= 0 ? coach : 0}days`,
            label: t('Coach'),
        },
    ]

    const SidebarElements = () => {
        if (sessionData) {
            return (
                <div className="flex flex-col max-w-xs">
                    <List
                        sx={{
                            width: '100%',
                            bgcolor: 'background.paper',
                        }}
                        subheader={
                            <ListSubheader
                                component="div"
                                id="nested-list-subheader"
                            >
                                {t('Data for')}{' '}
                                {moment(whenAdded).format('DD.MM.YYYY')}:
                            </ListSubheader>
                        }
                    >
                        {CIRCULAR_BOXES.map(({ href, text, value, label }) => (
                            <Link href={href} key={text}>
                                <ListItemButton>
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="center-progress-bar-label max-h-[80px] min-h-[80px] min-w-[80px] max-w-[80px]">
                                            <CircularProgressbar
                                                value={value}
                                                text={text}
                                                styles={buildStyles({
                                                    textSize: 15,
                                                    pathTransitionDuration: 0.5,
                                                    pathColor: '#90caf9',
                                                    textColor:
                                                        'rgba(122, 122, 122, 1',
                                                    trailColor: '#d6d6d6',
                                                    backgroundColor: '#90caf9',
                                                })}
                                            />
                                        </div>
                                        <div>{label}</div>
                                    </div>
                                </ListItemButton>
                            </Link>
                        ))}
                    </List>

                    {SidebarRightBlogList()}
                </div>
            )
        }

        return <LastJoinedUsersList />
    }

    return SidebarElements()
}

export default SidebarRight
