import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface DiagramCircularProps {
    text: string
    value: number
}

const DiagramCircular = ({ text, value }: DiagramCircularProps) => {
    const styles = buildStyles({
        pathTransitionDuration: 0.5,
        pathColor: '#90caf9',
        textColor: 'rgba(122, 122, 122, 1',
        trailColor: '#d6d6d6',
        backgroundColor: '#90caf9',
        textSize: 15,
    })

    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="max-h-[110px] max-w-[110px] center-progress-bar-label">
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
