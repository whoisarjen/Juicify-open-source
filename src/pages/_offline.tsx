import Logo from '@/components/Logo/Logo'

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
            <button
                className="mt-6 rounded border border-[#90caf9] px-4 py-2 text-[#90caf9] hover:bg-gray-800"
                onClick={() => window.location.reload()}
            >
                Try again
            </button>
        </div>
    )
}

export default Offline
