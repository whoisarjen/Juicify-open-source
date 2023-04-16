import useTranslation from "next-translate/useTranslation";

const NavbarOnlyTitle = ({ title }: { title: string }) => {
    const { t } = useTranslation()

    return <div className="text-3xl font-bold">{t(title)}</div>
}

export default NavbarOnlyTitle;