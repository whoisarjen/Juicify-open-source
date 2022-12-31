import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import NavbarOnlyTitle from "@/components/NavbarOnlyTitle/NavbarOnlyTitle"
import moment from "moment";
import { useSession } from "next-auth/react";

interface ChooseDietProps {
    setStep: (arg0: string) => void
}

const Grid = styled.div`
    width: 100%;
    min-height: calc(100vh - var(--BothNavHeightAndPadding));
    display: grid;
    grid-template-rows: 1fr 4fr 2fr auto auto;
    grid-gap: 5px;
    text-align: center;
    ${this} table {
        width: 100%;
    }
`

const Description = styled.div`
    margin: auto;
    padding: 20px 0;
`

const CheckingWeekData = ({ setStep }: ChooseDietProps) => {
    const { t } = useTranslation('coach')
    const { data: sessionData } = useSession()
    const [allowNextStep, setAllowNextStep] = useState(false)

    // useEffect(() => {
    //     let count = 0;
    //     if (data) {
    //         data.forEach((x: DailyMeasurementSchemaProps) => {
    //             if (new Date(getShortDate()).toJSON() == new Date(x.whenAdded).toJSON() && x.weight && x.weight > 0) {
    //                 count++;
    //             } else if (new Date(addDaysToDate(getShortDate(), -7)) > new Date(x.whenAdded) && x.weight && x.weight > 0) {
    //                 count++;
    //             }
    //         })
    //     }
    //     if (count == 2) {
    //         setAllowNextStep(true)
    //     } else {
    //         setAllowNextStep(false)
    //     }
    // }, [data])

    return (
        <Grid>
            {/* <NavbarOnlyTitle title="coach:CHECKING_TODAY_TITLE" />
            {
                <>
                    <table>
                        <tbody>
                            <th>{t("DATE")}</th>
                            <th>{t("WEIGHT")}</th>
                            {
                                data &&
                                data.length &&
                                data.map((x: DailyMeasurementSchemaProps) =>
                                    <tr key={x._id}>
                                        <td>{moment(x.whenAdded).format('DD.MM.YYYY')}</td>
                                        <td>{x.weight}kg</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {
                        !allowNextStep
                            ?
                            <Description>{t('CHECKING_WEEK_DESCRIPTION_ALTERNATIVE')}</Description>
                            :
                            <Description>{t('CHECKING_WEEK_DESCRIPTION')}</Description>
                    }
                    <AddWeight>
                        <Button variant="contained">{t('CHANGE_WEIGHT')}</Button>
                    </AddWeight>
                </>
            }
            <Button
                variant="contained"
                onClick={() => setStep('ChooseCaloriesSource')}
                disabled={!allowNextStep}>
                {t('CHECKING_TODAY_BUTTON')}
            </Button> */}
        </Grid>
    )
}

export default CheckingWeekData;