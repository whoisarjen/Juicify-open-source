import styled from "styled-components";
import BottomFlyingGuestBanner from "@/components/BottomFlyingGuestBanner/BottomFlyingGuestBanner";
import DiagramConsumedRemaining from "@/containers/consumed/DiagramConsumedRemaining/DiagramConsumedRemaining";
import SectionDiaryManaging from "@/containers/consumed/SectionDiaryManaging/SectionDiaryManaging";
import BoxMeal from "@/containers/consumed/BoxMeal/BoxMeal";
import ButtonShare from '@/components/ButtonShare/ButtonShare';
import { max, range } from 'lodash';
import DateChanger from '@/containers/consumed/DateChanger/DateChanger';
import DateChangerFast from "@/containers/consumed/DateChangerFast/DateChangerFast";
import Header from "@/components/Header/Header";
import useTranslation from "next-translate/useTranslation";
import BoxBurned from "@/containers/consumed/BoxBurned/BoxBurned";
import { env } from "@/env/client.mjs";
import useConsumed from "@/hooks/useConsumed";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Box = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 36px 36px;
    ${this} button {
        margin: auto;
    }
`

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
        <>
            <Box>
                <Header text={t('title')} />
                <ButtonShare />
                <DateChanger />
            </Box>

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
        </>
    );
};

export default Consumed;