import Button from '@mui/material/Button'
import useTranslation from 'next-translate/useTranslation'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'

interface CheckingTodayDataProps {
    setStep: (arg0: string) => void
}

const whenAdded = moment().format('YYYY-MM-DD')

const CheckingTodayData = ({ setStep }: CheckingTodayDataProps) => {
    const { t } = useTranslation('coach')
    const { data: sessionData } = useSession()
    const router: any = useRouter()

    const username = sessionData?.user?.username || ''

    const { data: measurement } = trpc.measurement.getDay.useQuery(
        { username, whenAdded },
        { enabled: !!username && !!whenAdded }
    )

    const weight = measurement?.weight || 0

    return (
        <div className="flex h-full flex-col gap-4">
            <NavbarOnlyTitle title="coach:CHECKING_TODAY_TITLE" />
            {weight ? (
                <>
                    <table className="flex-1 flex-col text-center">
                        <tbody>
                            <tr>
                                <th>{t('HEIGHT')}:</th>
                                <td>{sessionData?.user?.height}cm</td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <th>{t('WEIGHT')}:</th>
                                <td>{`${weight}kg`}</td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <th>{t('AGE')}:</th>
                                <td>
                                    {moment().diff(
                                        sessionData?.user?.birth,
                                        'years'
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex flex-1 items-center justify-center text-center">
                        {t('CHECKING_TODAY_DESCRIPTION')}
                    </div>
                    <Button
                        sx={{ margin: 'auto 0', width: '100%' }}
                        variant="contained"
                        onClick={() => router.push('/measurements')}
                    >
                        {t('ADD_WEIGHT')}
                    </Button>
                </>
            ) : (
                <>
                    <div />
                    <div>{t('CHECKING_TODAY_DESCRIPTION_ALTERNATIVE')}</div>
                    <Button
                        sx={{ width: '100%' }}
                        variant="contained"
                        color="error"
                        onClick={() => router.push('/measurements')}
                    >
                        {t('ADD_WEIGHT')}
                    </Button>
                </>
            )}
            <Button
                variant="contained"
                onClick={() => setStep('ChooseDiet')}
                disabled={weight == 0}
            >
                {t('CHECKING_TODAY_BUTTON')}
            </Button>
        </div>
    )
}

export default CheckingTodayData
