import { Share2 } from 'lucide-react';
import IconButton from '@mui/material/IconButton';

const ButtonShare = () => {
    const shareLocation = () => {
        navigator.share({
            url: location.href,
            title: 'Juicify.app'
        })
    }

    return (
        <div onClick={shareLocation}>
            <IconButton aria-label="Share">
                <Share2 className="text-[#90caf9]" />
            </IconButton>
        </div>
    )
}

export default ButtonShare;