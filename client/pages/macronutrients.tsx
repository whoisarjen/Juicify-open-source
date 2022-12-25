import LockOpenIcon from '@mui/icons-material/LockOpen';
import Button from '@mui/material/Button';
import styled from 'styled-components'
import Header from '@/components/Header/Header';
import DialogEditMacronutrients from '@/components/common/dialog-edit-macronutrients';
import { useAppSelector } from '@/hooks/useRedux';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import ButtonSubmitItems from '@/components/ButtonSubmitItems/ButtonSubmitItems';
import CustomSlider from '@/containers/macronutrients/CustomSlider/CustomSlider';
import BarMacronutrients from '@/containers/macronutrients/BarMacronutrients/BarMacronutrients';
import useAuth from '@/hooks/useAuth';

const Box = styled.div`
    display: grid;
    width: 100%;
    margin: 0 auto;
    max-width: 702px;
    min-height: calc(100vh - var(--BothNavHeightAndPadding));
`

const Grid = styled.div`
    width: 100%;
    height: calc( 100% - 50px );
    display: grid;
    grid-template-rows: 2fr 1fr;
`

const Grid__bar = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto;
    column-gap: 5px;
    cursor: pointer;
    transition: all .2s ease-in-out;
`

const Grid__slider = styled.div`
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
`

const Grid__description = styled.div`
    text-align: center;
    margin: auto;
    display: grid;
    grid-template-rows: 1fr auto;
    width: 100%;
    height: 100%;
    ${this} div{
        margin: auto;
    }
    ${this} button{
        margin: auto;
    }
`

const MacronutrientsPage = () => {
    const token = useAppSelector(state => state.token)
    const [macronutrients, setMacronutrients] = useState<any[]>([])
    const [oryginalMacronutrients, setOryginalMacronutrients] = useState<any[]>([])
    const [changeObject, setChangeObject] = useState<any>({})
    const [isOwnMacro, setIsOwnMacro] = useState(false)
    const { t } = useTranslation('macronutrients')
    const { updateUser } = useAuth()

    const changed = (newValue: any, key: string) => {
        let newMacro = JSON.parse(JSON.stringify(macronutrients))
        newMacro[changeObject.day][key] = newValue

        let value = newValue - changeObject[key]
        let numberPossibleObjectChange = macronutrients.filter(x => !x.locked && x.day != changeObject.day).length

        newMacro.forEach((x: any) => {
            if (!x.locked && x.day != changeObject.day) {
                let minus = Math.ceil(value / numberPossibleObjectChange)
                if (x[key] - minus < 0) {
                    minus = x[key]
                }
                value -= minus
                numberPossibleObjectChange -= 1
                x[key] -= minus
            }
        })

        if (value) {
            newMacro.forEach((x: any) => {
                if (!x.locked && x.day != changeObject.day) {
                    let minus = value
                    if (x[key] - minus < 0) {
                        minus = x[key]
                    }
                    value -= minus
                    numberPossibleObjectChange -= 1
                    x[key] -= minus

                }
            })
        }

        setMacronutrients(newMacro)
        setChangeObject({ ...changeObject, ...{ [key]: newValue }, ...{ choosen: true } })
    }

    const save = async () => {
        let isNewValue = false;
        for (let i = 0; i < oryginalMacronutrients.length; i++) {
            if (
                oryginalMacronutrients[i].proteins != macronutrients[i].proteins ||
                oryginalMacronutrients[i].carbs != macronutrients[i].carbs ||
                oryginalMacronutrients[i].fats != macronutrients[i].fats
            ) {
                isNewValue = true;
                break;
            }
        }

        if (isNewValue) {
            let newMacroDB = {} as any
            macronutrients.forEach((x: any, day: number) => {
                newMacroDB[`proteinsDay${day}` as keyof typeof newMacroDB] = x.proteins
                newMacroDB[`carbsDay${day}` as keyof typeof newMacroDB] = x.carbs
                newMacroDB[`fatsDay${day}` as keyof typeof newMacroDB] = x.fats
            })
            await updateUser(newMacroDB)
        }

        setChangeObject({})
        setMacronutrients(macronutrients.map(x => {
            x.choosen = false
            return x
        }))
    }

    const onChange = (object: any, state: boolean) => {
        setChangeObject(object)
        let newMacro = [...macronutrients]
        newMacro.map((x: any) => {
            x.choosen = false
            if (object.day === x.day) {
                x.choosen = state
            }
            return x
        })
        setMacronutrients(newMacro)
        !state && setChangeObject({})
    }

    const toggleLock = (object: any) => {
        let newMacro = [...macronutrients]
        newMacro[object.day].locked = !newMacro[object.day].locked
        setMacronutrients(newMacro)
    }

    useEffect(() => {
        if (token?.id) {
            const macro = [...Array(7)].map((_: number, day: number) => ({
                proteins: token[`proteinsDay${day}` as keyof typeof token] as number,
                carbs: token[`carbsDay${day}` as keyof typeof token] as number,
                fats: token[`fatsDay${day}` as keyof typeof token] as number,
                locked: false,
                day,
            }))
            setMacronutrients(macro)
            setOryginalMacronutrients(macro)
        }
    }, [token?.id])

    return (
        <>
            <Box>
                <div>
                    {Object.keys(changeObject).length == 0 && <Header text={t("macronutrients:TITLE")} />}
                    <Grid>
                        <Grid__bar>
                            {macronutrients.map((x: any, index: number) =>
                                <BarMacronutrients
                                    key={index}
                                    object={x}
                                    onClick={() => onChange(x, !x.choosen)}
                                    toggleLock={() => toggleLock(x)}
                                    t={t}
                                />
                            )}
                        </Grid__bar>
                        {Object.keys(changeObject).length > 0 ?
                            (
                                <Grid__slider>
                                    {[...Object.keys(changeObject)].map(x =>
                                        x != 'day' &&
                                        x != 'locked' &&
                                        x != 'choosen' &&
                                        <CustomSlider
                                            key={x}
                                            day={changeObject['day'] + changeObject[x]}
                                            title={x}
                                            beginValue={changeObject[x]}
                                            macro={macronutrients}
                                            changed={(value: any) => changed(value, x)}
                                        />
                                    )}
                                </Grid__slider>
                            ) : (
                                <Grid__description>
                                    <div>
                                        {t('DESCRIPTION')} <LockOpenIcon /> {t('DESCRIPTION_2')}
                                    </div>
                                    <Button variant="contained" onClick={() => setIsOwnMacro(true)}>{t('BUTTON')}</Button>
                                </Grid__description>
                            )}
                    </Grid>
                    {Object.keys(changeObject).length > 0 && <ButtonSubmitItems isShowNumber={false} clicked={save} />}
                </div>
            </Box>
            <DialogEditMacronutrients isOwnMacro={isOwnMacro} close={() => setIsOwnMacro(false)} />
        </>
    )
}

export default MacronutrientsPage;