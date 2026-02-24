import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(): State {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
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
                }}>
                    <h1 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Something went wrong
                    </h1>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
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
                        Reload page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
