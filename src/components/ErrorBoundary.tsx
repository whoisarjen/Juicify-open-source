import { Component, type ErrorInfo, type ReactNode } from 'react'
import { TRPCClientError } from '@trpc/client'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    statusCode: number | null
    message: string | null
}

const ERROR_MESSAGES: Record<number, string> = {
    400: 'Bad request',
    401: 'You need to sign in to access this page',
    403: 'You don\'t have permission to access this page',
    404: 'Page not found',
    408: 'Request timed out',
    429: 'Too many requests — please try again later',
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, statusCode: null, message: null }
    }

    static getDerivedStateFromError(error: Error): State {
        if (error instanceof TRPCClientError) {
            const httpStatus = error.data?.httpStatus ?? null
            return {
                hasError: true,
                statusCode: httpStatus,
                message: httpStatus ? (ERROR_MESSAGES[httpStatus] ?? error.message) : error.message,
            }
        }

        return { hasError: true, statusCode: null, message: null }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            const { statusCode, message } = this.state

            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    fontFamily: 'Quicksand, sans-serif',
                    color: '#7a7a7a',
                    backgroundColor: '#121212',
                    gap: '1rem',
                }}>
                    {statusCode && (
                        <span style={{ fontSize: '4rem', fontWeight: 700, color: '#90caf9' }}>
                            {statusCode}
                        </span>
                    )}
                    <h1 style={{ color: '#ffffff', fontSize: '1.5rem', margin: 0 }}>
                        {message || 'Something went wrong'}
                    </h1>
                    <button
                        onClick={() => { window.location.href = '/' }}
                        style={{
                            marginTop: '0.5rem',
                            padding: '12px 24px',
                            backgroundColor: '#90caf9',
                            color: '#121212',
                            border: 'none',
                            borderRadius: '8px',
                            fontFamily: 'Quicksand, sans-serif',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        Go home
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
