import useTranslation from "next-translate/useTranslation";
import { type ReactNode } from "react";

const NavbarOnlyTitle = ({ title, children }: { title: string, children?: ReactNode }) => {
    const { t } = useTranslation()

    return (
        <div className="win2k-titlebar w-full select-none">
            {/* Win2k window icon */}
            <span className="text-xs leading-none">🏋️</span>
            <h1 className="flex-1 text-[11px] font-bold text-white truncate">{t(title)}</h1>
            {children && (
                <div className="flex items-center gap-1">{children}</div>
            )}
            {/* Win2k window control buttons */}
            <div className="flex items-center gap-px ml-1">
                <button className="win2k-btn !px-1 !py-0 !min-h-0 h-[14px] w-[16px] text-[9px] font-bold leading-none flex items-center justify-center" aria-label="minimize">_</button>
                <button className="win2k-btn !px-1 !py-0 !min-h-0 h-[14px] w-[16px] text-[9px] font-bold leading-none flex items-center justify-center" aria-label="maximize">□</button>
                <button className="win2k-btn !px-1 !py-0 !min-h-0 h-[14px] w-[16px] text-[10px] font-bold leading-none flex items-center justify-center text-black" aria-label="close">✕</button>
            </div>
        </div>
    )
}

export default NavbarOnlyTitle;
