import Logo from '@/components/Logo/Logo'
import Button from '@mui/material/Button'

const Offline = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                fontFamily: 'Quicksand, sans-serif',
                backgroundColor: '#121212',
                color: '#ffffff',
                padding: '24px',
                textAlign: 'center',
            }}
        >
            <Logo size={80} />
            <h1 style={{ marginTop: '24px', fontSize: '1.5rem', fontWeight: 700 }}>
                You are offline
            </h1>
            <p style={{ marginTop: '12px', color: '#7a7a7a', maxWidth: '400px' }}>
                Check your internet connection and try again. Your data will sync when you are back online.
            </p>
            <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                sx={{ mt: 3, borderColor: '#90caf9', color: '#90caf9' }}
            >
                Try again
            </Button>
        </div>
    )
}

export default Offline
