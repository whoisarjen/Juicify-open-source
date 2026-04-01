import useTranslation from 'next-translate/useTranslation';
import { useState, useEffect, type ChangeEvent } from 'react';

interface CustomSliderProps {
    title: string,
    macro: Array<any>,
    beginValue: number,
    changed: (arg0: number) => void,
    day: number
}

const CustomSlider = ({ title, macro, beginValue, changed, day }: CustomSliderProps) => {
    const [value, setValue] = useState<any>(false);
    const [timer, setTimer] = useState<any>(null)
    const [maxValue, setMaxValue] = useState(0)
    const { t } = useTranslation('macronutrients')

    useEffect(() => setValue(beginValue), [beginValue, day])

    useEffect(() => {
        const key = title.toLowerCase()
        let count = 0
        macro.forEach(x => {
            if (!x.locked || x.day == day) {
                count += x[key]
            }
        })
        setMaxValue(count)
        if (value > count) {
            setValue(count)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [macro, day])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(Number(e.target.value));
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > maxValue) {
            setValue(maxValue);
        }
    };

    useEffect(() => {
        clearTimeout(timer)
        if (value !== false && value !== beginValue) {
            const changeFunction = (find: string) => setTimeout(async () => {
                changed(value)
            }, 500)
            setTimer(changeFunction(value))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <div className="my-0">
            <div className="flex items-center gap-4">
                <span className="min-w-[75px] text-center text-sm">
                    {t(title.toUpperCase())}
                </span>
                <input
                    type="range"
                    min={0}
                    max={maxValue}
                    value={value || 0}
                    onChange={handleChange}
                    className="flex-1 accent-blue-500"
                />
                <input
                    type="number"
                    min={0}
                    max={maxValue}
                    value={value}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    aria-labelledby="input-slider"
                    className="w-16 rounded border border-gray-300 bg-transparent px-2 py-1 text-center text-sm dark:border-gray-600"
                />
            </div>
        </div>
    );
}

export default CustomSlider;
