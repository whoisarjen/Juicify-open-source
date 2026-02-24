import { trpc } from '@/utils/trpc.utils';
import CoachContainer from './CoachContainer'
import { getCalories } from '@/utils/consumed.utils'
import { useSession } from 'next-auth/react';
import CoachButton from './CoachButton'
import { useRouter } from 'next/router';

interface ChooseAnalyzeSourceProps {
    analyze: (isDataInJuicify: boolean) => void
}

const ChooseAnalyzeSource = ({
    analyze,
}: ChooseAnalyzeSourceProps) => {
    const { data: sessionData } = useSession()
    const router = useRouter()

    const userId = sessionData?.user?.id || 0

    const {
        data,
    } = trpc
        .coach
        .getLastByUserId
        .useQuery({ userId }, { enabled: !!userId })

    const proteins = data?.countedProteins || 0
    const carbs = data?.countedCarbs || 0
    const fats = data?.countedFats || 0

    return (
        // TODO tranlsate
        <CoachContainer
            title="Źródło danych"
            description="Juicify wspiera dwie formy obliczania nowego celu kalorycznego - 
            bazując na danych wprowadzonych do aplikacji lub wykorzystując stałą wartość, 
            która została obliczona poprzednim razem (użyteczne, gdy wykorzystujesz inną aplikację do notowania spożywanych produktów).
            Pamiętaj, że waga notowana w aplikacji przez ostatni tydzień gra główną rolę, więć upewnij się, że jest ona poprawna!"
        >
            <CoachButton
                color="error"
                variant="contained"
                onClick={() => router.push('/measurements')}
            >
                Zweryfikuj wage
            </CoachButton>
            <CoachButton
                variant="contained"
                onClick={() => analyze(true)}
            >
                Oblicz z danymi z aplikacji
            </CoachButton>
            <CoachButton
                variant="contained"
                onClick={() => analyze(false)}
            >
                {`Oblicz z stałą wartością (${getCalories({ proteins, carbs, fats })}kcal)`}
            </CoachButton>
        </CoachContainer>
    )
}

export default ChooseAnalyzeSource;