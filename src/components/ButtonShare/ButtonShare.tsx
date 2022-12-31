import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';

const ButtonShare = () => {
    const shareLocation = () => {
        navigator.share({
            url: location.href,
            title: 'Juicify.app'
        })
    }

    return (
        <div style={{ margin: 'auto' }} data-testid="ButtonShare" onClick={shareLocation}>
            <IconButton>
                <ShareIcon color="primary" />
            </IconButton>
        </div>
    )
}

export default ButtonShare;