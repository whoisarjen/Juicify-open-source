import { useRouter } from "next/router";
import styled from "styled-components";
import BottomFlyingGuestBanner from "@/components/BottomFlyingGuestBanner/BottomFlyingGuestBanner";
import DiagramConsumedRemaining from "@/containers/consumed/DiagramConsumedRemaining/DiagramConsumedRemaining";
import SectionDiaryManaging from "@/containers/consumed/SectionDiaryManaging/SectionDiaryManaging";
import BoxMeal from "@/containers/consumed/BoxMeal/BoxMeal";
import ButtonShare from '@/components/ButtonShare/ButtonShare';
import { ConsumedFieldsFragment, useConsumedByWhenAndUsernameQuery } from '@/generated/graphql';
import { useEffect, useMemo } from 'react';
import { useAppSelector } from '@/hooks/useRedux';
import { max } from 'lodash';
import { multipleConsumedProductByHowMany } from '@/utils/consumed.utils'
import DateChanger from '@/containers/consumed/DateChanger/DateChanger';
import DateChangerFast from "@/containers/consumed/DateChangerFast/DateChangerFast";
import Header from "@/components/Header/Header";
import useTranslation from "next-translate/useTranslation";
import BoxBurned from "@/containers/consumed/BoxBurned/BoxBurned";

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
    const when = router?.query?.date
    const username = router?.query?.login
    const token = useAppSelector(state => state.token)
    const [{ data, fetching }, getConsumedByWhenAndUsername] = useConsumedByWhenAndUsernameQuery({
        variables: {
            when,
            username,
        },
        pause: true,
    })

    useEffect(() => {
        when && username && getConsumedByWhenAndUsername()
    }, [when, username])

    const { meals, isOwner } = useMemo(() => {
        const numberOfBoxes = max([
            data?.userByUsername?.numberOfMeals,
            process.env.DEFAULT_NUMBER_OF_MEALS,
            data?.consumedByWhenAndUsername?.at(-1)?.meal,
        ])

        const meals = [...Array(numberOfBoxes).fill([] as any)] as unknown as ConsumedFieldsFragment[][]

        data?.consumedByWhenAndUsername?.forEach(consumed => {
            if (consumed) {
                const newConsumed = multipleConsumedProductByHowMany(consumed)
                meals[consumed?.meal as any] =
                    meals[consumed?.meal as any]
                        ? [
                            ...meals[consumed?.meal as any],
                            newConsumed,
                        ]
                        : [newConsumed]
            }
        })

        return {
            meals,
            isOwner: token?.username === data?.userByUsername?.username
        }
    }, [data?.consumedByWhenAndUsername, data?.userByUsername, fetching])

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

            {meals.map((meal, i) => <BoxMeal key={i} index={i} meal={meal} isOwner={isOwner} />)}

            {!isOwner &&
                data?.userByUsername &&
                <BottomFlyingGuestBanner
                    id={data?.userByUsername?.id}
                    username={data?.userByUsername?.username}
                />
            }
        </>
    );
};

export default Consumed;