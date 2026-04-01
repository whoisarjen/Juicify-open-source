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
        <div className="flex w-full items-center justify-center gap-2">
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
                        <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="edit">
                            <Pencil size={20} />
                        </button>
                    </DialogEditBurnedCalories>
                ) : (
                    icon || (
                        <Flame
                            size={20}
                            className="text-red-500 m-[4px_4px_4px_6px]"
                        />
                    )
                )}
            </div>
            <div className="flex-1">
                <div className="font-bold">{name}</div>
                <div>{burnedCalories}kcal</div>
            </div>
            {redirectTo &&
                <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="edit" onClick={() => router.push(redirectTo)}>
                    <Info size={20} />
                </button>
            }
        </div>
    )
}

export default BoxBurnedItem
