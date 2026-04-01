import { Flame, Pencil, Info } from 'lucide-react'
import { type ReactNode } from 'react'
import { DialogEditBurnedCalories } from '../DialogEditBurnedCalories'
import { useRouter } from 'next/router'

interface BoxBurnedItemProps {
    name: string
    burnedCalories: number
    isEditable?: boolean
    icon?: ReactNode
    id: number
    whenAdded: Date
    redirectTo?: string
}

const BoxBurnedItem = ({
    name,
    burnedCalories,
    isEditable,
    icon,
    id,
    whenAdded,
    redirectTo,
}: BoxBurnedItemProps) => {
    const router = useRouter()

    return (
        <div className="flex w-full items-center gap-2 py-1">
            <div className="flex items-center justify-center">
                {isEditable ? (
                    <DialogEditBurnedCalories
                        burnedCalories={{
                            name,
                            burnedCalories,
                            id,
                            whenAdded,
                        }}
                    >
                        <button type="button" className="w-[28px] h-[28px] rounded-lg bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-[#7a7a7a] hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer" aria-label="edit">
                            <Pencil size={13} />
                        </button>
                    </DialogEditBurnedCalories>
                ) : (
                    icon || (
                        <Flame
                            size={16}
                            className="text-macro-fat mx-1"
                        />
                    )
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{name}</div>
            </div>
            <div className="text-xs font-bold text-macro-fat shrink-0">{burnedCalories}kcal</div>
            {redirectTo &&
                <button className="w-[28px] h-[28px] rounded-lg bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-[#7a7a7a] hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer" aria-label="info" onClick={() => router.push(redirectTo)}>
                    <Info size={13} />
                </button>
            }
        </div>
    )
}

export default BoxBurnedItem
