import { Fragment } from 'react'
import BoxBurnedItem from './BoxBurnedItem/BoxBurnedItem'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
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
        burnedCaloriesSum,
    } = useBurned({ username, startDate: whenAdded, endDate: whenAdded })

    return (
        <div className="flex w-full flex-col gap-3 rounded border p-3 text-sm">
            <div className="flex w-full items-center justify-center">
                <div className="flex-1 flex-col">
                    <div className="font-bold text-red-500">
                        Burned calories
                    </div>
                    <div>{burnedCaloriesSum}kcal</div>
                </div>
                <div>
                    {router.query.login === sessionData?.user?.username ? (
                        <DialogAddBurnedCalories>
                            <IconButton aria-label="Add" color="primary">
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </DialogAddBurnedCalories>
                    ) : (
                        <div />
                    )}
                </div>
            </div>

            {workoutResults.map(({ id, name, burnedCalories, whenAdded }) => (
                <Fragment key={id}>
                    <div className="h-[1px] w-full bg-white" />
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
                        <div className="h-[1px] w-full bg-white" />
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
