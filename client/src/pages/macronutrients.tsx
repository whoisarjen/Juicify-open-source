import LockOpenIcon from '@mui/icons-material/LockOpen'
import Button from '@mui/material/Button'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import ButtonSubmitItems from '@/components/ButtonSubmitItems/ButtonSubmitItems'
import CustomSlider from '@/containers/macronutrients/CustomSlider/CustomSlider'
import BarMacronutrients from '@/containers/macronutrients/BarMacronutrients/BarMacronutrients'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'
import { reloadSession } from '@/utils/global.utils'
import DialogEditMacronutrients from '@/components/DialogEditMacronutrients/DialogEditMacronutrients'
import NavbarOnlyTitle from '@/components/NavbarOnlyTitle/NavbarOnlyTitle'

const MacronutrientsPage = () => {
    const { data: sessionData } = useSession()
    const [macronutrients, setMacronutrients] = useState<any[]>([])
    const [oryginalMacronutrients, setOryginalMacronutrients] = useState<any[]>(
        []
    )
    const [changeObject, setChangeObject] = useState<any>({})
    const [isOwnMacro, setIsOwnMacro] = useState(false)
    const { t } = useTranslation('macronutrients')

    const updateUser = trpc.user.update.useMutation({
        onSuccess(data, variables, context) {
            reloadSession()
        },
    })

    const changed = (newValue: any, key: string) => {
        let newMacro = [...macronutrients]
        newMacro[changeObject.day][key] = newValue

        let value = newValue - changeObject[key]
        let numberPossibleObjectChange = macronutrients.filter(
            (x) => !x.locked && x.day != changeObject.day
        ).length

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
        setChangeObject({
            ...changeObject,
            [key]: newValue,
            choosen: true,
        })
    }

    const save = async () => {
        let isNewValue = false
        for (let i = 0; i < oryginalMacronutrients.length; i++) {
            if (
                oryginalMacronutrients[i].proteins !=
                    macronutrients[i].proteins ||
                oryginalMacronutrients[i].carbs != macronutrients[i].carbs ||
                oryginalMacronutrients[i].fats != macronutrients[i].fats
            ) {
                isNewValue = true
                break
            }
        }

        if (isNewValue) {
            let newMacroDB = {} as any
            macronutrients.forEach((x: any, day: number) => {
                newMacroDB[`proteinsDay${day}` as keyof typeof newMacroDB] =
                    x.proteins
                newMacroDB[`carbsDay${day}` as keyof typeof newMacroDB] =
                    x.carbs
                newMacroDB[`fatsDay${day}` as keyof typeof newMacroDB] = x.fats
            })

            await updateUser.mutateAsync(newMacroDB)
        }

        setChangeObject({})
        setMacronutrients(
            macronutrients.map((macronutrient) => ({
                ...macronutrient,
                choosen: false,
            }))
        )
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
        if (!sessionData?.user) {
            return
        }

        const macro = [...Array(7)].map((_: number, day: number) => ({
            proteins: sessionData?.user?.[
                `proteinsDay${day}` as keyof typeof sessionData.user
            ] as number,
            carbs: sessionData?.user?.[
                `carbsDay${day}` as keyof typeof sessionData.user
            ] as number,
            fats: sessionData?.user?.[
                `fatsDay${day}` as keyof typeof sessionData.user
            ] as number,
            locked: false,
            day,
        }))

        setMacronutrients(macro)
        setOryginalMacronutrients(macro)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionData?.user])

    const changeObjectKeysLength = Object.keys(changeObject).length

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col">
                <div className="flex flex-1 flex-col gap-4">
                    {changeObjectKeysLength == 0 && (
                        <NavbarOnlyTitle title="macronutrients:TITLE" />
                    )}
                    <div className="flex flex-1 cursor-pointer flex-row gap-2">
                        {macronutrients.map((x: any, index: number) => (
                            <BarMacronutrients
                                key={index}
                                object={x}
                                onClick={() => onChange(x, !x.choosen)}
                                toggleLock={() => toggleLock(x)}
                                t={t}
                            />
                        ))}
                    </div>
                    {changeObjectKeysLength > 0 ? (
                        <div className="flex flex-col">
                            {[...Object.keys(changeObject)].map(
                                (x) =>
                                    x != 'day' &&
                                    x != 'locked' &&
                                    x != 'choosen' && (
                                        <CustomSlider
                                            key={x.toString()}
                                            day={
                                                changeObject['day'] +
                                                changeObject[x]
                                            }
                                            title={x.toString()}
                                            beginValue={changeObject[x]}
                                            macro={macronutrients}
                                            changed={(value: any) =>
                                                changed(value, x.toString())
                                            }
                                        />
                                    )
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="flex flex-1 items-center justify-center text-center">
                                <div>
                                    {t('DESCRIPTION')} <LockOpenIcon />{' '}
                                    {t('DESCRIPTION_2')}
                                </div>
                            </div>
                            <Button
                                variant="contained"
                                onClick={() => setIsOwnMacro(true)}
                            >
                                {t('BUTTON')}
                            </Button>
                        </div>
                    )}
                </div>
                {changeObjectKeysLength > 0 && (
                    <ButtonSubmitItems isShowNumber={false} clicked={save} />
                )}
            </div>
            <DialogEditMacronutrients
                isOwnMacro={isOwnMacro}
                onClose={() => setIsOwnMacro(false)}
            />
        </div>
    )
}

export default MacronutrientsPage
