import LockOpenIcon from '@mui/icons-material/LockOpen'
import IconButton from '@mui/material/IconButton'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import moment from 'moment'

interface BarMacronutrientsProps {
    object: {
        proteins: number
        carbs: number
        fats: number
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
                <div className="flex h-[30%] items-center justify-center rounded-t bg-orange-400 text-white">
                    {object.proteins} {t('P')}
                </div>
                <div className="flex h-[30%] items-center justify-center bg-yellow-400 text-white">
                    {object.carbs} {t('C')}
                </div>
                <div className="flex h-[30%] items-center justify-center bg-green-400 text-white">
                    {object.fats} {t('F')}
                </div>
                <div className="flex h-[10%] items-center justify-center rounded-b bg-blue-400 text-white">
                    {object.proteins * 4 + object.carbs * 4 + object.fats * 9}
                </div>
            </div>
            <div className="flex w-full items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center">
                    {object.locked ? (
                        <IconButton
                            data-testid="button"
                            onClick={toggleLock}
                            color="secondary"
                            style={{ margin: 'auto' }}
                        >
                            <LockOutlinedIcon data-testid="LockOutlinedIcon" />
                        </IconButton>
                    ) : (
                        <IconButton
                            data-testid="button"
                            onClick={toggleLock}
                            color="primary"
                            style={{ margin: 'auto' }}
                        >
                            <LockOpenIcon data-testid="LockOpenIcon" />
                        </IconButton>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BarMacronutrients
