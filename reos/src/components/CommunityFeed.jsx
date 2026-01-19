import { Megaphone } from 'lucide-react'
import { useEmergencySystem } from '../hooks/useEmergencySystem.js'

export default function CommunityFeed() {
    const { activeAlerts } = useEmergencySystem()

    // Filter for public alerts (Fire, Security) and ignore Medical (Privacy)
    const publicAlerts = activeAlerts.filter(
        a => a.type === 'Fire' || a.type === 'Security'
    )

    if (publicAlerts.length === 0) return null

    return (
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-slate-300">
                <Megaphone className="h-4 w-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                    Community Updates
                </h3>
            </div>
            <div className="space-y-2">
                {publicAlerts.map(alert => (
                    <div
                        key={alert.id}
                        className="flex items-start gap-3 rounded-xl border border-slate-700/30 bg-slate-800/30 p-3"
                    >
                        <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full animate-pulse ${alert.type === 'Fire' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        <div className="space-y-0.5">
                            <p className="text-xs font-medium text-slate-200">
                                {alert.type} Reported
                            </p>
                            <p className="text-[10px] text-slate-400">
                                Level {String(alert.flat).charAt(0)} • Please remain vigilant
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
