import { useEffect, useState } from 'react'
import { MessageSquare } from 'lucide-react'

export default function CommunicationLog({ activeAlerts }) {
    const [logs, setLogs] = useState([])

    useEffect(() => {
        if (activeAlerts.length === 0) return

        const newAlerts = activeAlerts.filter(a => !logs.find(l => l.alertId === a.id))

        if (newAlerts.length > 0) {
            const newLogs = newAlerts.map(alert => ({
                id: Date.now() + Math.random(),
                alertId: alert.id,
                time: new Date().toLocaleTimeString(),
                message: `Dispatching SMS to registered contacts for Flat ${alert.flat}...`,
                status: 'Sent'
            }))

            setLogs(prev => [...newLogs, ...prev].slice(0, 5))
        }
    }, [activeAlerts])

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                    Comms Uplink
                </h2>
                <MessageSquare className="h-4 w-4 text-slate-500" />
            </div>
            <div className="space-y-2">
                {logs.length === 0 && (
                    <div className="text-[10px] text-slate-600 italic">No recent transmissions</div>
                )}
                {logs.map(log => (
                    <div key={log.id} className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
                        <span className="text-slate-500">[{log.time}]</span>
                        <span className="flex-1 truncate">{log.message}</span>
                        <span className="text-emerald-400">✓ {log.status}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
