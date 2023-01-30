import IconButton from '@mui/material/IconButton';
import styled from "styled-components";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EditIcon from "@mui/icons-material/Edit";
import { type ReactNode } from 'react';
import { DialogEditBurnedCalories } from '../DialogEditBurnedCalories';

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
    color: #fff;
`

interface BoxBurnedItemProps {
    name: string
    burnedCalories: number
    isEditable?: boolean
    icon?: ReactNode
    id: number
    whenAdded: Date
}

const BoxBurnedItem = ({
    name,
    burnedCalories,
    isEditable,
    icon,
    id,
    whenAdded,
}: BoxBurnedItemProps) => {
    return (
        <Burned>
            <EditButtonContainer>
                <FireIcon>
                    {isEditable
                        ? <DialogEditBurnedCalories burnedCalories={{ name, burnedCalories, id, whenAdded }}>
                            <IconButton aria-label="edit">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </DialogEditBurnedCalories>
                        : icon || <LocalFireDepartmentIcon fontSize="small" sx={{ color: 'red' }} />
                    }
                </FireIcon>
            </EditButtonContainer>
            <Content>
                <div>{name}</div>
                <div>{burnedCalories}kcal</div>
            </Content>
            <Content />
        </Burned>
    )
}

export default BoxBurnedItem;