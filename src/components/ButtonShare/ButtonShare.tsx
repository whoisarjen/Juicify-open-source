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
            <button className="rounded-full p-2 hover:bg-[rgba(255,255,255,0.04)] transition-all" aria-label="Share">
                <Share2 size={20} className="text-primary-dark" />
            </button>
        </div>
    )
}

export default ButtonShare;