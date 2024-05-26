import BottomFlyingGuestBanner from "@/components/BottomFlyingGuestBanner/BottomFlyingGuestBanner";
import DiagramConsumedRemaining from "@/containers/consumed/DiagramConsumedRemaining/DiagramConsumedRemaining";
import SectionDiaryManaging from "@/containers/consumed/SectionDiaryManaging/SectionDiaryManaging";
import BoxMeal from "@/containers/consumed/BoxMeal/BoxMeal";
import ButtonShare from '@/components/ButtonShare/ButtonShare';
import { max, range } from 'lodash';
import DateChanger from '@/containers/consumed/DateChanger/DateChanger';
import DateChangerFast from "@/containers/consumed/DateChangerFast/DateChangerFast";
import useTranslation from "next-translate/useTranslation";
import BoxBurned from "@/containers/consumed/BoxBurned/BoxBurned";
import { env } from "@/env/client.mjs";
import useConsumed from "@/hooks/useConsumed";
import { useRouter } from "next/router";
import IconButton from '@mui/material/IconButton'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import CustomAvatar from '@/components/CustomAvatar/CustomAvatar'

const Consumed = () => {
    const { t } = useTranslation('nutrition-diary')
    const router = useRouter()
    const { data: sessionData } = useSession()

    const username = router.query.login as unknown as string
    const whenAdded = router.query.date as unknown as string
    const isOwner = username == sessionData?.user?.username

    const { data } = useConsumed({ username, startDate: whenAdded, endDate: whenAdded })

    const lastMeal = data.at(-1)

    const numberOfMeals = max([
        isOwner ? sessionData?.user?.numberOfMeals : 0,
        env.NEXT_PUBLIC_DEFAULT_NUMBER_OF_MEALS,
        lastMeal?.meal,
    ])

    const meals = range(0, numberOfMeals)
        .map((_, index) => data
            .filter(({ meal }) => meal === index))

    return (
        <div className="flex flex-col gap-4 flex-1">
            <div className="w-full flex items-center justify-center">
                <div className="flex-1 text-3xl font-bold">{t('title')}</div>
                <ButtonShare />
                <DateChanger />
                {username === sessionData?.user?.username &&
                    <Link href={`/${sessionData?.user?.username}`}>
                        <IconButton color="primary">
                            <CustomAvatar
                                src={sessionData?.user?.image}
                                username={sessionData?.user?.username}
                                size="28px"
                            />
                        </IconButton>
                    </Link>
                }
            </div>

            <DateChangerFast />

            <DiagramConsumedRemaining
                username={username}
                startDate={whenAdded}
                endDate={whenAdded}
            />

            {isOwner && <SectionDiaryManaging />}

            <BoxBurned />

            {meals.map((meal, i) =>
                <BoxMeal
                    key={i}
                    index={i}
                    meal={meal}
                    isOwner={isOwner}
                />
            )}

            {!isOwner && lastMeal &&
                <BottomFlyingGuestBanner
                    src={lastMeal.user.image}
                    username={lastMeal.user.username}
                />
            }
        </div>
    );
};

export default Consumed;