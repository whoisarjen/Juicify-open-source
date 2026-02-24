import { useRouter } from "next/router";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import useTranslation from "next-translate/useTranslation";

const SelectLanguage = () => {
    const router: any = useRouter();
    const { t } = useTranslation("home");

    const setLanguage = (value: string) => {
        document.cookie = `NEXT_LOCALE=${value}; expires=${new Date(new Date().setFullYear(new Date().getFullYear() + 20))}; path=/`;
        router.push(router.asPath, router.asPath, { locale: value });
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t("Language")}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={router.locale}
                autoWidth
                onChange={(e) => setLanguage(e.target.value)}
                label={t("Language")}
                sx={{ marginBottom: '10px' }}
            >
                {router.locales.map((locale: any) => (
                    <MenuItem key={locale} value={locale}>
                        {locale}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}


export default SelectLanguage