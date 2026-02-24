import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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
        <Tabs
            data-testid="tabs"
            value={tab}
            onChange={(e, value) => changedTab(value)}
            indicatorColor="primary"
            textColor="inherit"
            variant="fullWidth"
            sx={{ marginBottom: '10px' }}
        >
            <Tab wrapped label={t('All')} />
            {/* <Tab wrapped label={t('Favourite')} /> */}
            <Tab wrapped label={`${t('Selected')} (${checkedLength})`} />
        </Tabs>
    )
}

export default TabsAddDialog;