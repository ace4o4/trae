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
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-amber-500">
                <Megaphone className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                    Community Safety Alerts
                </h3>
            </div>
            <div className="space-y-2">
                {publicAlerts.map(alert => (
                    <div
                        key={alert.id}
                        className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-900/10 p-2"
                    >
                        <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 animate-pulse" />
                        <div className="space-y-0.5">
                            <p className="text-xs font-medium text-amber-200">
                                {alert.type} reported
                            </p>
                            <p className="text-[10px] text-amber-400/80">
                                Level {String(alert.flat).charAt(0)} • Please remain vigilant
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
