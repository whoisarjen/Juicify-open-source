import useTranslation from "next-translate/useTranslation";
import { type ReactNode } from "react";

const NavbarOnlyTitle = ({ title, children }: { title: string, children?: ReactNode }) => {
    const { t } = useTranslation()

    return (
        <div className="w-full flex items-center">
            <h1 className="flex-1 text-lg font-semibold text-zinc-200">{t(title)}</h1>
            {children && (
                <div className="flex items-center gap-1">{children}</div>
            )}
        </div>
    )
}

export default NavbarOnlyTitle;
