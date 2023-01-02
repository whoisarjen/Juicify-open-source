import CheckingTodayData from "@/containers/coach/CheckingTodayData";
import CheckingWeekData from "@/containers/coach/CheckingWeekData";
import ChooseCaloriesSource from "@/containers/coach/ChooseCaloriesSource";
import ChooseDiet from "@/containers/coach/ChooseDiet";
import LosingWeight from "@/containers/coach/LosingWeight";
import MuscleBuilding from "@/containers/coach/MuscleBuilding";
import Recomposition from "@/containers/coach/Recomposition";
import Result from "@/containers/coach/Result";
import Standard from "@/containers/coach/Standard";
import Tutorial_1 from "@/containers/coach/Tutorial_1";
import Tutorial_2 from "@/containers/coach/Tutorial_2";
import Tutorial_3 from "@/containers/coach/Tutorial_3";
import Tutorial_4 from "@/containers/coach/Tutorial_4";
import Tutorial_5 from "@/containers/coach/Tutorial_5";
import Tutorial_6 from "@/containers/coach/Tutorial_6";
import Tutorial_7 from "@/containers/coach/Tutorial_7";
import Welcome from "@/containers/coach/Welcome";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export interface PrepareObject {
    goal: number
    kindOfDiet: number
    isSportActive: boolean
    activityLevel: number
}

const Coach = () => {
    const { data: sessionData } = useSession()
    const [step, setStep] = useState(sessionData?.user?.isCoachAnalyze ? 'Standard' : 'Welcome')
    const when = new Date().toISOString().slice(0, 10)
    const username = sessionData?.user?.username || ''
    // const [{ data }, getDailyByWhenAndUsernameQuery] = useDailyByWhenAndUsernameQuery({
    //     variables: {
    //         when,
    //         username,
    //     },
    //     pause: true,
    // })
    // const [{ data: createCoachData }, createCoach] = useCreateCoachMutation()

    const data: any = null // TODO
    const createCoachData: any = null // TODO

    const prepareCreate = async (object: PrepareObject) => {
        if (!data?.measurementByWhenAndUsername?.weight) {
            return null
        }

        // await createCoach({
        //     id: uuidv4(),
        //     user: sessionData?.user?.id,
        //     weight: data.measurementByWhenAndUsername.weight,
        //     ...object,
        // })

        setStep('Result')
    }

    const prepareAnalize = async (isUseData: boolean) => {
        //     const response = await post({
        //         url: '/coach/analyze',
        //         object: {
        //             isUseData,
        //             today: getShortDate(),
        //             age: getAge(token.birth),
        //             // data: await loadMissingDays(await getAllIndexedDB('daily_measurement'), token._id, 15, getShortDate())
        //         }
        //     })
        //     // await dispatchToken(response.data)
        //     setStep('Result')
    }

    const handlePreviousStep = () => setStep(sessionData?.user?.isCoachAnalyze ? 'Standard' : 'Welcome')

    useEffect(() => {
        if (when && username) {
            getDailyByWhenAndUsernameQuery()
            setStep(sessionData?.user?.isCoachAnalyze ? 'Standard' : 'Welcome')
        }
    }, [when, username])

    return (
        <div className="coach">
            {
                step === 'Welcome' ?
                    (
                        <>
                            <Welcome setStep={setStep} />
                        </>
                    ) : step === 'CheckingTodayData' ? (
                        <>
                            <CheckingTodayData setStep={setStep} weight={data?.measurementByWhenAndUsername?.weight || 0} />
                        </>
                    ) : step === 'ChooseDiet' ? (
                        <>
                            <ChooseDiet setStep={setStep} handlePreviousStep={handlePreviousStep} />
                        </>
                    ) : step === 'MuscleBuilding' ? (
                        <>
                            <MuscleBuilding prepareCreate={prepareCreate} handlePreviousStep={handlePreviousStep} />
                        </>
                    ) : step === 'Recomposition' ? (
                        <>
                            <Recomposition prepareCreate={prepareCreate} handlePreviousStep={handlePreviousStep} />
                        </>
                    ) : step === 'LosingWeight' ? (
                        <>
                            <LosingWeight prepareCreate={prepareCreate} handlePreviousStep={handlePreviousStep} />
                        </>
                    ) : step === 'Standard' ? (
                        <>
                            <Standard setStep={setStep} />
                        </>
                    ) : step === 'CheckingWeekData' ? (
                        <>
                            <CheckingWeekData setStep={setStep} />
                        </>
                    ) : step === 'ChooseCaloriesSource' ? (
                        <>
                            <ChooseCaloriesSource prepareAnalize={prepareAnalize} />
                        </>
                    ) : step === 'Result' ? (
                        <>
                            <Result setStep={setStep} data={createCoachData} />
                        </>
                    ) : step === 'Tutorial_1' ? (
                        <>
                            <Tutorial_1 setStep={setStep} handlePreviousStep={handlePreviousStep} />
                        </>
                    ) : step === 'Tutorial_2' ? (
                        <>
                            <Tutorial_2 setStep={setStep} />
                        </>
                    ) : step === 'Tutorial_3' ? (
                        <>
                            <Tutorial_3 setStep={setStep} />
                        </>
                    ) : step === 'Tutorial_4' ? (
                        <>
                            <Tutorial_4 setStep={setStep} />
                        </>
                    ) : step === 'Tutorial_5' ? (
                        <>
                            <Tutorial_5 setStep={setStep} />
                        </>
                    ) : step === 'Tutorial_6' ? (
                        <>
                            <Tutorial_6 setStep={setStep} />
                        </>
                    ) : step === 'Tutorial_7' ? (
                        <>
                            <Tutorial_7 setStep={setStep} handlePreviousStep={handlePreviousStep} />
                        </>
                    ) : (
                        <>
                            {"We didn't code anything like that :("}
                            <button onClick={() => setStep('Welcome')}></button>
                        </>
                    )
            }
        </div>
    );
};

export default Coach;