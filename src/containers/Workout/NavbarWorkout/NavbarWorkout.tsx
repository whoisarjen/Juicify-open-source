import { Save, Trash2, ArrowLeft } from 'lucide-react'
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

interface NavbarWorkoutProp {
    isDisabled: boolean
    isLoading: boolean
    onSave: () => void
    onDelete: () => void
    onArrowBack: () => void
}

const NavbarWorkout = ({
    isDisabled,
    onArrowBack,
    isLoading,
    onSave,
    onDelete,
}: NavbarWorkoutProp) => {
    const router = useRouter()
    const { t } = useTranslation('workout')
    const { data: sessionData } = useSession()

    return (
        <div className="win2k-titlebar w-full select-none">
            {/* Win2k icon */}
            <span className="text-xs leading-none">🏋️</span>
            <div className="flex-1 text-[11px] font-bold text-white truncate">Workout Result</div>
            {/* Toolbar buttons */}
            <div className="flex items-center gap-1">
                <button
                    className="win2k-btn flex items-center gap-1"
                    aria-label="Back"
                    onClick={onArrowBack}
                >
                    <ArrowLeft size={11} /> Back
                </button>
                {sessionData?.user?.username == router.query.login && (
                    <>
                        <DialogConfirm onConfirmed={onDelete} isDisabled={isDisabled}>
                            <button
                                disabled={isDisabled}
                                className="win2k-btn flex items-center gap-1"
                                aria-label="delete"
                            >
                                <Trash2 size={11} /> Delete
                            </button>
                        </DialogConfirm>
                        <button
                            disabled={isDisabled || isLoading}
                            onClick={onSave}
                            className="win2k-btn flex items-center gap-1"
                        >
                            {isLoading ? (
                                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                            ) : (
                                <Save size={11} />
                            )}
                            {t('Save')}
                        </button>
                    </>
                )}
            </div>
            {/* Win2k window control buttons */}
            <div className="flex items-center gap-px ml-1">
                <button className="win2k-btn !px-1 !py-0 !min-h-0 h-[14px] w-[16px] text-[9px] font-bold leading-none flex items-center justify-center" aria-label="minimize">_</button>
                <button className="win2k-btn !px-1 !py-0 !min-h-0 h-[14px] w-[16px] text-[9px] font-bold leading-none flex items-center justify-center" aria-label="maximize">□</button>
                <button className="win2k-btn !px-1 !py-0 !min-h-0 h-[14px] w-[16px] text-[10px] font-bold leading-none flex items-center justify-center text-black" aria-label="close">✕</button>
            </div>
        </div>
    );
}

export default NavbarWorkout;
