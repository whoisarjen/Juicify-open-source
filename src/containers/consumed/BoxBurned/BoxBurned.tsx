import styled from "styled-components";
import BoxBurnedItem from "./BoxBurnedItem/BoxBurnedItem";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import useBurned from "@/hooks/useBurned";
import { DialogAddBurnedCalories } from "./DialogAddBurnedCalories";

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
        burnedCalories = [],
        workoutResults = [],
        burnedCaloriesSum,
    } = useBurned({ username, startDate: whenAdded, endDate: whenAdded })

    return (
        <Grid>
            <Bolded>Burned calories</Bolded>
            <AddButtonContainer>
                {router.query.login === sessionData?.user?.username
                    ? <DialogAddBurnedCalories>
                        <IconButton
                            sx={{ margin: 'auto' }}
                            aria-label="Add"
                            color="primary"
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </DialogAddBurnedCalories>
                    : <div />
                }
            </AddButtonContainer>
            <div>{burnedCaloriesSum}kcal</div>

            {workoutResults.map(({ id, name, burnedCalories, whenAdded }) =>
                <BoxBurnedItem
                    key={id}
                    id={id}
                    name={name}
                    burnedCalories={burnedCalories}
                    whenAdded={whenAdded}
                />
            )}

            {burnedCalories.map(({ id, name, burnedCalories, whenAdded, userId }) =>
                <BoxBurnedItem
                    key={id}
                    id={id}
                    name={name}
                    burnedCalories={burnedCalories}
                    isEditable={userId === sessionData?.user?.id}
                    whenAdded={whenAdded}
                />
            )}
        </Grid >
    );
};

export default BoxBurned;