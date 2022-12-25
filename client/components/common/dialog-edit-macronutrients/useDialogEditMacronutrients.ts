import useTranslation from "next-translate/useTranslation"
import { useState, useEffect } from "react"
import { DialogEditMacronutrientsProps } from "."
import { useAppSelector } from "../../../hooks/useRedux"

const useDialogEditMacronutrients = ({ isOwnMacro, close }: DialogEditMacronutrientsProps) => {
    const token = useAppSelector(state => state.token)
    const [isDialog, setIsDialog] = useState(false)
    const [proteins, setProteins] = useState(0)
    const [carbs, setCarbs] = useState(0)
    const [fats, setFats] = useState(0)
    // const { changeSettings } = useSettings()
    const { t } = useTranslation('macronutrients')

    const handleConfirm = async () => {
        setIsDialog(false)
        let macronutrients = []
        for (let i = 1; i < 8; i++) {
            macronutrients.push({
                proteins,
                carbs,
                fats,
                day: i
            })
        }
        // await changeSettings({ macronutrients })
        close()
    }

    useEffect(() => {
        if (token) {
            // setProteins(token.macronutrients[0].proteins)
            // setCarbs(token.macronutrients[0].carbs)
            // setFats(token.macronutrients[0].fats)
        }
    }, [token.id])

    return { isOwnMacro, close, t, proteins, setProteins, carbs, setCarbs, fats, setFats, isDialog, setIsDialog, handleConfirm }
}

export type useDialogEditMacronutrientsProps = ReturnType<typeof useDialogEditMacronutrients>

export default useDialogEditMacronutrients;