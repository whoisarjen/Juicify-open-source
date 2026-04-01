import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';

interface TabsItemsProps {
    changeTab: (tab: number) => void,
    checkedLength: number
}

const TabsAddDialog = ({ changeTab, checkedLength = 0 }: TabsItemsProps) => {
    const [tab, setTab] = useState(0)
    const { t } = useTranslation('home');

    const changedTab = (value: number) => {
        setTab(value)
        changeTab(value)
    }

    return (
        <div
            data-testid="tabs"
            className="mb-2.5 flex border-b border-gray-200 dark:border-gray-700"
        >
            <button
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                    tab === 0
                        ? 'border-b-2 border-blue-500 text-blue-500'
                        : 'text-gray-500'
                }`}
                onClick={() => changedTab(0)}
            >
                {t('All')}
            </button>
            <button
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                    tab === 1
                        ? 'border-b-2 border-blue-500 text-blue-500'
                        : 'text-gray-500'
                }`}
                onClick={() => changedTab(1)}
            >
                {`${t('Selected')} (${checkedLength})`}
            </button>
        </div>
    )
}

export default TabsAddDialog;