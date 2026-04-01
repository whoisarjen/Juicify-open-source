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
        <div className="flex w-full">
            <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 m-auto" aria-label="route" onClick={onArrowBack}>
                <ArrowLeft />
            </button>
            <div className="flex-1" />
            {sessionData?.user?.username == router.query.login
                ? <>
                    <DialogConfirm onConfirmed={onDelete} isDisabled={isDisabled}>
                        <button disabled={isDisabled} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 m-auto disabled:opacity-50" aria-label="delete">
                            <Trash2 />
                        </button>
                    </DialogConfirm>
                    <button
                        disabled={isDisabled || isLoading}
                        onClick={onSave}
                        className="rounded bg-primary-dark px-4 py-2 text-[#121212] hover:bg-[#64b5f6] disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <Save size={18} />
                        )}
                        {t('Save')}
                    </button>
                </>
                : <>
                    <div />
                    <div />
                </>
            }
        </div>
    );
}

export default NavbarWorkout;
