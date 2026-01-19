import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'

export default function GuardLogin({ onLogin }) {
    const [pin, setPin] = useState('')
    const [error, setError] = useState(false)

    const handleSubmit = e => {
        e.preventDefault()
        // Simple PIN check - in production use proper auth
        if (pin === '1234') {
            onLogin()
        } else {
            setError(true)
            setPin('')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-200">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-800 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                        <ShieldCheck className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold tracking-tight">
                        Guard Access
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Enter security PIN to access the dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={pin}
                                onChange={e => {
                                    setPin(e.target.value)
                                    setError(false)
                                }}
                                className="block w-full rounded-lg border border-slate-800 bg-slate-900 p-4 text-center text-2xl tracking-[1em] text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                placeholder="••••"
                                maxLength={4}
                                autoFocus
                            />
                        </div>
                        {error && (
                            <p className="text-center text-sm text-red-400 animate-pulse">
                                Incorrect PIN. Access denied.
                            </p>
                        )}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                        >
                            Authenticate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
