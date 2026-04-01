import useTranslation from 'next-translate/useTranslation'

const ButtonCloseDialog = ({ clicked }: { clicked: () => void }) => {
    const { t } = useTranslation('home')

    return (
        <>
            <div className="h-14 w-full" />
            <div
                onClick={clicked}
                className="fixed bottom-0 left-0 z-10 flex w-full items-center justify-center bg-gray-100 p-2 dark:bg-gray-800"
            >
                <button className="flex-1 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50" aria-label="Close dialog">
                    {t('Close')}
                </button>
            </div>
        </>
    )
}

export default ButtonCloseDialog
