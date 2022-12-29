import { useRouter } from "next/router";
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
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import moment from "moment";
import { env } from "@/env/client.mjs";

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
    const router: any = useRouter()
    const whenAdded = moment(router?.query?.date).toDate()
    const username = router?.query?.login
    const { data: sessionData } = useSession()

    const {
        data = [],
    } = trpc
        .consumed
        .getDay
        .useQuery({ username, whenAdded }, { enabled: !!(username && whenAdded) })

    const lastMeal = data.at(-1)

    const isOwner = sessionData?.user?.username == lastMeal?.user?.username

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

            <DiagramConsumedRemaining />

            <SectionDiaryManaging isOwner={isOwner} />

            <BoxBurned isOwner={isOwner} />

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