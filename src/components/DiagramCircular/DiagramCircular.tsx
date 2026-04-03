import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface DiagramCircularProps {
    text: string
    value: number
    pathColor?: string
}

const DiagramCircular = ({ text, value, pathColor = '#34d399' }: DiagramCircularProps) => {
    const styles = buildStyles({
        pathTransitionDuration: 0.5,
        pathColor,
        textColor: '#9ca3af',
        trailColor: 'rgba(255, 255, 255, 0.04)',
        textSize: 9,
    })

    return (
        <div className="flex items-center justify-center">
            <div className="h-[100px] w-[100px] center-progress-bar-label lg:h-[120px] lg:w-[120px]">
                <CircularProgressbar
                    value={value}
                    text={text}
                    styles={styles}
                />
            </div>
        </div>
    )
}

export default DiagramCircular
