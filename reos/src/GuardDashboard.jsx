import { useEffect, useRef } from 'react'
import { ActivitySquare, BellRing } from 'lucide-react'
import BuildingGrid from './components/BuildingGrid.jsx'
import AlertLog from './components/AlertLog.jsx'
import AIAlertSummary from './components/AIAlertSummary.jsx'
import CommunicationLog from './components/CommunicationLog.jsx'
import { useEmergencySystem } from './hooks/useEmergencySystem.js'

function GuardDashboard() {
  const { alerts, activeAlerts, resolveAlert } = useEmergencySystem()
  const audioRef = useRef(null)
  const previousCountRef = useRef(0)

  useEffect(() => {
    const currentCount = alerts.length
    if (currentCount > previousCountRef.current && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current
        .play()
        .catch(() => { })
    }
    previousCountRef.current = currentCount
  }, [alerts])

  const latestAlert = activeAlerts.length > 0 ? activeAlerts[0] : null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/50 bg-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
              <ActivitySquare className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                REOS Command Center
              </h1>
              <p className="text-[11px] text-slate-500">
                Digital twin of Tower A in real time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300">
                Link online
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(248,113,113,0.9)]" />
              <span className="font-mono uppercase tracking-widest">
                {activeAlerts.length} active
              </span>
            </div>
          </div>
        </header>
        <main className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <BuildingGrid activeAlerts={activeAlerts} />
          <div className="flex flex-col gap-4">
            <AIAlertSummary latestAlert={latestAlert} />
            <AlertLog alerts={activeAlerts} onResolve={resolveAlert} />
            <CommunicationLog activeAlerts={activeAlerts} />
          </div>
        </main>
        <audio ref={audioRef} src="/siren.mp3" preload="auto" />
      </div>
    </div>
  )
}

export default GuardDashboard

