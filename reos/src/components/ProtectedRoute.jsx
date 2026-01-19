import { useState } from 'react'
import GuardLogin from './GuardLogin'

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('guard_token') === 'true'
    })

    const handleLogin = () => {
        sessionStorage.setItem('guard_token', 'true')
        setIsAuthenticated(true)
    }

    if (!isAuthenticated) {
        return <GuardLogin onLogin={handleLogin} />
    }

    return children
}
