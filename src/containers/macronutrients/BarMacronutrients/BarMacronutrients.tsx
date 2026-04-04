import { LockOpen, Lock } from 'lucide-react'
import moment from 'moment'

interface BarMacronutrientsProps {
    object: {
        proteins: number
        carbs: number
        fats: number
        minProteins?: number
        minCarbs?: number
        minFats?: number
        day: number
        locked: boolean
        choosen?: boolean
    }
    onClick?: (arg0: object) => void
    toggleLock?: (arg0: object) => void
    t: (arg0: string) => string
}

const BarMacronutrients = ({
    object,
    onClick,
    toggleLock,
    t,
}: BarMacronutrientsProps) => {
    const hasMin = (object.minProteins || 0) > 0 || (object.minCarbs || 0) > 0 || (object.minFats || 0) > 0

    const fmtRange = (min: number | undefined, target: number) => {
        if (min && min > 0) return `${min}–${target}`
        return `${target}`
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex w-full items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    {moment().day(object.day).format('dd')}
                </div>
            </div>
            <div
                className={
                    object.choosen
                        ? 'my-4 flex-1 scale-105  transition'
                        : 'my-4 flex-1 transition hover:scale-105'
                }
                onClick={onClick}
            >
                <div className="flex h-[30%] items-center justify-center rounded-t bg-orange-400 text-white text-[11px]">
                    {fmtRange(object.minProteins, object.proteins)} {t('P')}
                </div>
                <div className="flex h-[30%] items-center justify-center bg-yellow-400 text-white text-[11px]">
                    {fmtRange(object.minCarbs, object.carbs)} {t('C')}
                </div>
                <div className="flex h-[30%] items-center justify-center bg-green-400 text-white text-[11px]">
                    {fmtRange(object.minFats, object.fats)} {t('F')}
                </div>
                <div className="flex h-[10%] items-center justify-center rounded-b bg-primary-dark text-[#121212] text-[11px]">
                    {hasMin
                        ? `${(object.minProteins || 0) * 4 + (object.minCarbs || 0) * 4 + (object.minFats || 0) * 9}–${object.proteins * 4 + object.carbs * 4 + object.fats * 9}`
                        : object.proteins * 4 + object.carbs * 4 + object.fats * 9
                    }
                </div>
            </div>
            <div className="flex w-full items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center">
                    {object.locked ? (
                        <button
                            data-testid="button"
                            onClick={toggleLock}
                            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                            style={{ margin: 'auto' }}
                        >
                            <Lock data-testid="LockOutlinedIcon" />
                        </button>
                    ) : (
                        <button
                            data-testid="button"
                            onClick={toggleLock}
                            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                            style={{ margin: 'auto' }}
                        >
                            <LockOpen data-testid="LockOpenIcon" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BarMacronutrients
