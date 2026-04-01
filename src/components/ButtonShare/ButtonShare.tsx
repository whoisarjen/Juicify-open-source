import { Share2 } from 'lucide-react';

const ButtonShare = () => {
    const shareLocation = () => {
        navigator.share({
            url: location.href,
            title: 'Juicify.app'
        })
    }

    return (
        <div onClick={shareLocation}>
            <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Share">
                <Share2 className="text-[#90caf9]" />
            </button>
        </div>
    )
}

export default ButtonShare;