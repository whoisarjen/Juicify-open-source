import Head from 'next/head'

interface FullPageErrorProps {
    code: number
    message: string
}

const FullPageError = ({ code, message }: FullPageErrorProps) => {
    return (
        <>
        <Head>
            <title>{code} — {message} | Juicify</title>
            <meta name="robots" content="noindex, nofollow" />
            <meta name="description" content={message} />
        </Head>
        <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#121212',
            fontFamily: 'Quicksand, sans-serif',
            gap: '1rem',
            zIndex: 9999,
        }}>
            <span style={{ fontSize: '4rem', fontWeight: 700, color: '#90caf9' }}>
                {code}
            </span>
            <h1 style={{ color: '#ffffff', fontSize: '1.5rem', margin: 0 }}>
                {message}
            </h1>
            <a
                href="/"
                style={{
                    marginTop: '0.5rem',
                    padding: '12px 24px',
                    backgroundColor: '#90caf9',
                    color: '#121212',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    cursor: 'pointer',
                }}
            >
                Go home
            </a>
        </div>
        </>
    )
}

export default FullPageError
