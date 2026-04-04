import { LockOpen } from 'lucide-react'
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

    const changedMin = (newValue: any, key: string) => {
        const minKey = `min${key.charAt(0).toUpperCase() + key.slice(1)}`
        let newMacro = [...macronutrients]
        // Clamp to target value
        const clamped = Math.min(newValue, newMacro[changeObject.day][key])
        newMacro[changeObject.day][minKey] = clamped

        setMacronutrients(newMacro)
        setChangeObject({
            ...changeObject,
            [minKey]: clamped,
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
                oryginalMacronutrients[i].fats != macronutrients[i].fats ||
                oryginalMacronutrients[i].minProteins != macronutrients[i].minProteins ||
                oryginalMacronutrients[i].minCarbs != macronutrients[i].minCarbs ||
                oryginalMacronutrients[i].minFats != macronutrients[i].minFats
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
                newMacroDB[`minProteinsDay${day}` as keyof typeof newMacroDB] =
                    x.minProteins
                newMacroDB[`minCarbsDay${day}` as keyof typeof newMacroDB] =
                    x.minCarbs
                newMacroDB[`minFatsDay${day}` as keyof typeof newMacroDB] =
                    x.minFats
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
            minProteins: (sessionData?.user?.[
                `minProteinsDay${day}` as keyof typeof sessionData.user
            ] as number) || 0,
            minCarbs: (sessionData?.user?.[
                `minCarbsDay${day}` as keyof typeof sessionData.user
            ] as number) || 0,
            minFats: (sessionData?.user?.[
                `minFatsDay${day}` as keyof typeof sessionData.user
            ] as number) || 0,
            locked: false,
            day,
        }))

        setMacronutrients(macro)
        setOryginalMacronutrients(macro)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionData?.user])

    const changeObjectKeysLength = Object.keys(changeObject).length

    // Filter slider keys: show target macros (proteins, carbs, fats) only
    const targetKeys = changeObjectKeysLength > 0
        ? (Object.keys(changeObject) as string[]).filter(
            (x: string) => x !== 'day' && x !== 'locked' && x !== 'choosen' &&
                !x.startsWith('min')
        )
        : []

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
                        <div className="flex flex-col gap-1">
                            {/* Target sliders */}
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#555] px-1">
                                {t('TARGET')}
                            </div>
                            {targetKeys.map((x) => (
                                <CustomSlider
                                    key={x}
                                    day={
                                        changeObject['day'] +
                                        changeObject[x]
                                    }
                                    title={x}
                                    beginValue={changeObject[x]}
                                    macro={macronutrients}
                                    changed={(value: any) =>
                                        changed(value, x)
                                    }
                                />
                            ))}

                            {/* Min sliders */}
                            <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.04)]">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-[#555] px-1 mb-1">
                                    {t('MINIMUM')}
                                </div>
                                {targetKeys.map((x) => {
                                    const minKey = `min${x.charAt(0).toUpperCase() + x.slice(1)}`
                                    return (
                                        <div key={minKey} className="flex items-center gap-2">
                                            <span className="min-w-[75px] text-center text-xs text-[#555]">
                                                {t(x.toUpperCase())}
                                            </span>
                                            <input
                                                type="range"
                                                min={0}
                                                max={changeObject[x] || 0}
                                                value={macronutrients[changeObject.day]?.[minKey] || 0}
                                                onChange={(e) => changedMin(Number(e.target.value), x)}
                                                className="flex-1 accent-blue-500/50"
                                            />
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={macronutrients[changeObject.day]?.[minKey] || 0}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value.replace(',', '.')) || 0
                                                    changedMin(val, x)
                                                }}
                                                className="w-16 rounded border border-[rgba(255,255,255,0.06)] bg-transparent px-2 py-1 text-center text-xs text-[#7a7a7a]"
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="flex flex-1 items-center justify-center text-center">
                                <div>
                                    {t('DESCRIPTION')} <LockOpen className="inline" />{' '}
                                    {t('DESCRIPTION_2')}
                                </div>
                            </div>
                            <button
                                className="rounded bg-primary-dark px-4 py-2 text-[#121212] hover:bg-[#64b5f6] disabled:opacity-50"
                                onClick={() => setIsOwnMacro(true)}
                            >
                                {t('BUTTON')}
                            </button>
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
