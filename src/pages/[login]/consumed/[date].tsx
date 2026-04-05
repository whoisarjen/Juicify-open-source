import NavbarOnlyTitle from "@/components/NavbarOnlyTitle/NavbarOnlyTitle";
import DiagramConsumedRemaining from "@/containers/consumed/DiagramConsumedRemaining/DiagramConsumedRemaining";
import SectionDiaryManaging from "@/containers/consumed/SectionDiaryManaging/SectionDiaryManaging";
import BoxMeal from "@/containers/consumed/BoxMeal/BoxMeal";
import ButtonShare from '@/components/ButtonShare/ButtonShare';
import { max, range } from 'lodash-es';
import DateChanger from '@/containers/consumed/DateChanger/DateChanger';
import DateChangerFast from "@/containers/consumed/DateChangerFast/DateChangerFast";
import useTranslation from "next-translate/useTranslation";
import BoxBurned from "@/containers/consumed/BoxBurned/BoxBurned";
import BoxMorningPulse from "@/containers/consumed/BoxMorningPulse/BoxMorningPulse";
import BoxSupplements from "@/containers/consumed/BoxSupplements/BoxSupplements";
import { env } from "@/env/client.mjs";
import useConsumed from "@/hooks/useConsumed";
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Settings } from 'lucide-react'

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
        <div className="flex flex-col gap-4 flex-1 min-w-0">
            <NavbarOnlyTitle title="nutrition-diary:title">
                <ButtonShare />
                <DateChanger />
                {username === sessionData?.user?.username &&
                    <Link href="/settings">
                        <button className="rounded-full p-2 hover:bg-[rgba(255,255,255,0.04)] transition-all cursor-pointer">
                            <Settings size={20} className="text-primary-dark" />
                        </button>
                    </Link>
                }
            </NavbarOnlyTitle>

            <DateChangerFast />

            {/* Command Center: single column (split layout ready for icon sidebar switch) */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <DiagramConsumedRemaining
                        username={username}
                        startDate={whenAdded}
                        endDate={whenAdded}
                    />

                    {isOwner && <SectionDiaryManaging />}

                    {isOwner && <BoxMorningPulse whenAdded={whenAdded} />}

                    {isOwner && <BoxSupplements whenAdded={whenAdded} />}

                    <BoxBurned />
                </div>

                {/* Right panel — meals */}
                <div className="flex flex-col gap-4">
                    {meals.map((meal, i) =>
                        <BoxMeal
                            key={i}
                            index={i}
                            meal={meal}
                            isOwner={isOwner}
                        />
                    )}
                </div>
            </div>

        </div>
    );
};

export default Consumed;