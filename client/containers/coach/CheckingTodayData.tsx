import Button from '@mui/material/Button';
import { useAppSelector } from "../../hooks/useRedux";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import NavbarOnlyTitle from "@/components/NavbarOnlyTitle/NavbarOnlyTitle"
import moment from 'moment';
import { useRouter } from 'next/router';

const Grid = styled.div`
    width: 100%;
    height: calc(100vh - var(--BothNavHeightAndPadding));
    display: grid;
    grid-template-rows: 1fr 2fr 1fr auto auto;
    row-gap: 5px;
    text-align: center;
    ${this} table {
        table-layout: fixed;
        width: 100%;
    }
`

interface CheckingTodayDataProps {
    setStep: (arg0: string) => void
    weight: number
}

const CheckingTodayData = ({ setStep, weight }: CheckingTodayDataProps) => {
    const { t } = useTranslation('coach')
    const token = useAppSelector(state => state.token)
    const router: any = useRouter()

    return (
        <Grid>
            <NavbarOnlyTitle title="coach:CHECKING_TODAY_TITLE" />
            {
                (
                    weight
                        ?
                        <>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>{t('HEIGHT')}:</th>
                                        <td>{token.height}cm</td>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <th>{t('WEIGHT')}:</th>
                                        <td>{weight}kg</td>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <th>{t('AGE')}:</th>
                                        <td>{moment().diff(token.birth, 'years')}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>{t('CHECKING_TODAY_DESCRIPTION')}</div>
                            <Button
                                sx={{ margin: 'auto 0', width: '100%' }}
                                variant="contained"
                                onClick={() => router.push('/measurements')}
                            >{t('ADD_WEIGHT')}</Button>
                        </>
                        :
                        <>
                            <div />
                            <div>{t('CHECKING_TODAY_DESCRIPTION_ALTERNATIVE')}</div>
                            <Button
                                sx={{ width: '100%' }}
                                variant="contained"
                                color="error"
                                onClick={() => router.push('/measurements')}
                            >{t('ADD_WEIGHT')}</Button>
                        </>
                )
            }
            <Button variant="contained" onClick={() => setStep('ChooseDiet')} disabled={weight == 0}>{t('CHECKING_TODAY_BUTTON')}</Button>
        </Grid>
    )
}

export default CheckingTodayData;