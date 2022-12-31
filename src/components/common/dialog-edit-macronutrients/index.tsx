import BaseDialogEditMacronutrients from "./DialogEditMacronutrients";
import useDialogEditMacronutrients from "./useDialogEditMacronutrients";

export interface DialogEditMacronutrientsProps {
    isOwnMacro: boolean,
    close: () => void
}

const DialogEditMacronutrients = ({ isOwnMacro, close }: DialogEditMacronutrientsProps) => {
    const props = useDialogEditMacronutrients({ isOwnMacro, close })

    return <BaseDialogEditMacronutrients {...props} />
}

export default DialogEditMacronutrients;