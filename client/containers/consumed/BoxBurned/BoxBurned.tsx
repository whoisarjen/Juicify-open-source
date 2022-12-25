import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";
import useTranslation from "next-translate/useTranslation";
import { useAppDispatch } from "@/hooks/useRedux";
import BoxBurnedItem from "./BoxBurnedItem/BoxBurnedItem";
import { useWorkoutResultsByWhenQuery } from "@/generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Grid = styled.div`
    width: calc(100% - 24px);
    border: 1px solid #e4e4e4;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 12px;
    min-height: 50px;
    display: grid;
    grid-template-columns: auto 44px;
    font-size: 0.875rem;
`

const Bolded = styled.div`
    font-weight: bold;
    color: red
`

const AddButtonContainer = styled.div`
    grid-column: 2;
    grid-row: 1/3;
    width: 100%;
    min-height: 44px;
    height: 100%;
    display: grid;
    margin: auto;
    ${this} div{
        margin: auto;
    }
`

interface BoxMealProps {
    isOwner: boolean
}

const BoxBurned = ({
    isOwner,
}: BoxMealProps) => {
    const router: any = useRouter()
    const [{ data }, getWorkoutResultsByWhen] = useWorkoutResultsByWhenQuery({
        variables: {
            when: router?.query?.date,
            username: router?.query?.login,
        }
    })

    useEffect(() => {
        router?.query?.login && router?.query?.date && getWorkoutResultsByWhen()
    }, [router?.query?.login, router?.query?.date])

    if (!data?.workoutResultsByWhen?.length) {
        return null
    }

    return (
        <Grid>
            <Bolded>Burned calories</Bolded>
            <AddButtonContainer>
                {/* {isOwner
                    ? <IconButton
                        sx={{ margin: 'auto' }}
                        aria-label="Add"
                        color="primary"
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>
                    : <div />
                } */}
                <div />
            </AddButtonContainer>
            <div>{data?.workoutResultsByWhen?.reduce((prev, current) => prev + (current?.burnedCalories || 0), 0)}kcal</div>

            {data?.workoutResultsByWhen?.map(workoutResult => workoutResult &&
                <BoxBurnedItem
                    key={workoutResult?.id}
                    workoutResult={workoutResult}
                />
            )}
        </Grid >
    );
};

export default BoxBurned;