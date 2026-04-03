import { Fragment } from 'react'
import BoxBurnedItem from './BoxBurnedItem/BoxBurnedItem'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Plus } from 'lucide-react'
import useBurned from '@/hooks/useBurned'
import { DialogAddBurnedCalories } from './DialogAddBurnedCalories'

const BoxBurned = () => {
    const router = useRouter()
    const { data: sessionData } = useSession()

    const username = router.query.login as string
    const whenAdded = router.query.date as string

    const {
        burnedCalories = [],
        workoutResults = [],
        burnedCaloriesTotalSum,
    } = useBurned({ username, startDate: whenAdded, endDate: whenAdded })

    return (
        <div className="glass p-4">
            <div className="flex w-full items-center justify-between mb-2">
                <div>
                    <div className="text-[11px] font-bold uppercase tracking-wide text-[#7a7a7a]">
                        Burned calories
                    </div>
                    <div className="text-sm font-bold text-burned">
                        {burnedCaloriesTotalSum}kcal
                    </div>
                </div>
                {router.query.login === sessionData?.user?.username ? (
                    <DialogAddBurnedCalories>
                        <button className="w-[28px] h-[28px] rounded-lg border border-glass-border bg-glass flex items-center justify-center text-[#7a7a7a] hover:border-glass-border-accent hover:text-primary-dark transition-all duration-300 cursor-pointer" aria-label="Add">
                            <Plus size={14} />
                        </button>
                    </DialogAddBurnedCalories>
                ) : (
                    <div />
                )}
            </div>

            {workoutResults.map(({ id, name, burnedCalories, whenAdded }) => (
                <Fragment key={id}>
                    <div className="h-px w-full bg-glass-border my-1" />
                    <BoxBurnedItem
                        id={id}
                        name={name}
                        burnedCalories={burnedCalories}
                        whenAdded={whenAdded}
                        redirectTo={`/${router.query.login}/workout/results/${id}`}
                    />
                </Fragment>
            ))}

            {burnedCalories.map(
                ({ id, name, burnedCalories, whenAdded, userId }) => (
                    <Fragment key={id}>
                        <div className="h-px w-full bg-glass-border my-1" />
                        <BoxBurnedItem
                            id={id}
                            name={name}
                            burnedCalories={burnedCalories}
                            isEditable={userId === sessionData?.user?.id}
                            whenAdded={whenAdded}
                        />
                    </Fragment>
                )
            )}
        </div>
    )
}

export default BoxBurned
