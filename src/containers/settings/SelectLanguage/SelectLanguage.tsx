import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

const SelectLanguage = () => {
    const router: any = useRouter();
    const { t } = useTranslation("home");

    const setLanguage = (value: string) => {
        document.cookie = `NEXT_LOCALE=${value}; expires=${new Date(new Date().setFullYear(new Date().getFullYear() + 20))}; path=/`;
        router.push(router.asPath, router.asPath, { locale: value });
    }

    return (
        <div className="mb-2.5 w-full">
            <label className="mb-1 block text-sm text-gray-500">{t("Language")}</label>
            <select
                className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-600"
                value={router.locale}
                onChange={(e) => setLanguage(e.target.value)}
            >
                {router.locales.map((locale: any) => (
                    <option key={locale} value={locale}>
                        {locale}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default SelectLanguage
