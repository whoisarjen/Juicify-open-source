import IconButton from '@mui/material/IconButton'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import EditIcon from '@mui/icons-material/Edit'
import { type ReactNode } from 'react'
import { DialogEditBurnedCalories } from '../DialogEditBurnedCalories'

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
        <div className="flex w-full items-center justify-center gap-2">
            <div className="flex items-center justify-center">
                {isEditable ? (
                    <DialogEditBurnedCalories
                        burnedCalories={{
                            name,
                            burnedCalories,
                            id,
                            whenAdded,
                        }}
                    >
                        <IconButton aria-label="edit">
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </DialogEditBurnedCalories>
                ) : (
                    icon || (
                        <LocalFireDepartmentIcon
                            fontSize="small"
                            sx={{ color: 'red', margin: '4px 4px 4px 6px' }}
                        />
                    )
                )}
            </div>
            <div className="flex-1">
                <div className="font-bold">{name}</div>
                <div>{burnedCalories}kcal</div>
            </div>
        </div>
    )
}

export default BoxBurnedItem
