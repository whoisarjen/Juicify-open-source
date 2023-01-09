import styled from "styled-components";
import BoxBurnedItem from "./BoxBurnedItem/BoxBurnedItem";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";

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

const BoxBurned = () => {
    const router = useRouter()
    const { data: sessionData } = useSession()

    const username = router.query.login as string
    const whenAdded = router.query.date as string

    const {
        data: workoutResults = [],
    } = trpc
        .workoutResult
        .getDay
        .useQuery({
            username,
            whenAdded,
        }, { enabled: username == sessionData?.user?.username && !!username && !!whenAdded })

    if (!workoutResults.length) {
        return null
    }

    return (
        <Grid>
            <Bolded>Burned calories TEST TEST TEST</Bolded>
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
            <div>{workoutResults.reduce((prev, current) => prev + (current?.burnedCalories || 0), 0)}kcal</div>

            {workoutResults.map(workoutResult =>
                <BoxBurnedItem
                    key={workoutResult?.id}
                    workoutResult={workoutResult}
                />
            )}
        </Grid >
    );
};

export default BoxBurned;