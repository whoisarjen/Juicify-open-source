import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useState, useEffect } from "react"
import { DialogEditMacronutrientsProps } from "."

const useDialogEditMacronutrients = ({ isOwnMacro, close }: DialogEditMacronutrientsProps) => {
    const { data } = useSession()
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
        if (data?.user) {
            // setProteins(data?.user.macronutrients[0].proteins)
            // setCarbs(data?.user.macronutrients[0].carbs)
            // setFats(data?.user.macronutrients[0].fats)
        }
    }, [data?.user?.id])

    return { isOwnMacro, close, t, proteins, setProteins, carbs, setCarbs, fats, setFats, isDialog, setIsDialog, handleConfirm }
}

export type useDialogEditMacronutrientsProps = ReturnType<typeof useDialogEditMacronutrients>

export default useDialogEditMacronutrients;