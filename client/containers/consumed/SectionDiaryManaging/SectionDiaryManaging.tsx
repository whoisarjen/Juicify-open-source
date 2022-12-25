import Button from '@mui/material/Button';
import PieChartIcon from '@mui/icons-material/PieChart';
import styled from "styled-components";
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const Box = styled.div`
    display: grid;
    margin-bottom: 24px;
`

const Buttons = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    min-height: 36.5px
`

interface SectionDiaryManagingProps {
    isOwner: boolean
}

const SectionDiaryManaging = ({
    isOwner,
}: SectionDiaryManagingProps) => {
    const router: any = useRouter()
    const { t } = useTranslation('nutrition-diary')

    return (
        <Box>
            <Buttons>
                {isOwner
                    ? <Button
                        onClick={() => router.push('/macronutrients')}
                        color="primary"
                        variant="outlined"
                        aria-label="macronutrients"
                        component="span"
                        startIcon={<PieChartIcon />}
                    >
                        {t('Macronutrients')}
                    </Button>
                    : <div />
                }
            </Buttons>
        </Box>
    )
}

export default SectionDiaryManaging;