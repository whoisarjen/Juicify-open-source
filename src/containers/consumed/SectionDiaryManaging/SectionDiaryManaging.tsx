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

const SectionDiaryManaging = () => {
    const router = useRouter()
    const { t } = useTranslation('nutrition-diary')

    return (
        <Box>
            <Buttons>
                <Button
                    onClick={() => router.push('/macronutrients')}
                    color="primary"
                    variant="outlined"
                    aria-label="macronutrients"
                    component="span"
                    startIcon={<PieChartIcon />}
                >
                    {t('Macronutrients')}
                </Button>
            </Buttons>
        </Box>
    )
}

export default SectionDiaryManaging;