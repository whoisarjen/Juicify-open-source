import { useAppDispatch } from "@/hooks/useRedux";
import IconButton from '@mui/material/IconButton';
import styled from "styled-components";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EditIcon from "@mui/icons-material/Edit";

const Burned = styled.div`
    width: 100%;
    min-height: 50px;
    border-top: 1px solid #e4e4e4;
    margin-top: 10px;
    padding: 15px 0 5px;
    display: grid;
    grid-template-columns: 44px auto 44px;
    grid-column: 1 / 3;
`

const EditButtonContainer = styled.div`
    margin: auto;
    grid-row: 1 / 2;
`

const Content = styled.div`
    width: 100%;
    display: grid;
    ${this} div:nth-child(1) {
        font-weight: bold;
        margin-top: auto;
    }
    ${this} div:nth-child(2) {
        margin-bottom: auto;
    }
`

const FireIcon = styled.div`
    display: grid;
    margin: auto;
    grid-row: 1 / 2;
    color: red;
`

interface BoxBurnedItemProps {
    workoutResult: WorkoutResult
}

const BoxBurnedItem = ({
    workoutResult,
}: BoxBurnedItemProps) => {
    // const handleDialogEditConsumed = () => {
    //     dispatch(setSelectedConsumed(consumed))
    //     dispatch(setIsDialogEditConsumed(true))
    // }

    return (
        <Burned>

            <EditButtonContainer>
                {/* <IconButton aria-label="edit">
                    <EditIcon fontSize="small" />
                </IconButton> */}
                <FireIcon>
                    <LocalFireDepartmentIcon fontSize="small" />
                </FireIcon>
            </EditButtonContainer>

            <Content>
                <div>{workoutResult.name}</div>
                <div>{workoutResult.burnedCalories}kcal</div>
            </Content>

            <Content>
                {/* <FireIcon>
                    <LocalFireDepartmentIcon fontSize="small" />
                </FireIcon> */}
            </Content>

        </Burned>
    )
}

export default BoxBurnedItem;