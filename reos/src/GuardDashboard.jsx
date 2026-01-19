import { useEffect, useRef, useState } from 'react'
import { ActivitySquare, BellRing } from 'lucide-react'
import BuildingGrid from './components/BuildingGrid.jsx'
import AlertLog from './components/AlertLog.jsx'
import AIAlertSummary from './components/AIAlertSummary.jsx'
import CommunicationLog from './components/CommunicationLog.jsx'
import { useEmergencySystem } from './hooks/useEmergencySystem.js'

function GuardDashboard() {
  const { alerts, activeAlerts, resolveAlert, isDemoMode } = useEmergencySystem()
  const audioRef = useRef(null)
  const previousCountRef = useRef(0)
  const [audioEnabled, setAudioEnabled] = useState(false)

  useEffect(() => {
    if (!audioEnabled) return
    const currentCount = alerts.length
    if (currentCount > previousCountRef.current && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current
        .play()
        .catch(e => console.error("Audio play failed:", e))
    }
    previousCountRef.current = currentCount
  }, [alerts, audioEnabled])

  const latestAlert = activeAlerts.length > 0 ? activeAlerts[0] : null

  if (!audioEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 font-sans">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/20 duration-1000" />
          <button
            onClick={() => setAudioEnabled(true)}
            className="group relative flex h-40 w-40 flex-col items-center justify-center gap-3 rounded-full border border-cyan-500/30 bg-slate-900/50 backdrop-blur-xl transition-all hover:scale-105 hover:border-cyan-400 hover:shadow-[0_0_50px_rgba(34,211,238,0.2)] active:scale-95"
          >
            <ActivitySquare className="h-12 w-12 text-cyan-400 transition-transform duration-500 group-hover:rotate-90" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Initialize
            </span>
          </button>
        </div>
      </div>
    )
  }

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
            <div className={`flex items-center gap-2 rounded-full border px-3 py-1 ${isDemoMode ? 'border-amber-500/50 bg-amber-900/20' : 'border-slate-700 bg-slate-900/80'}`}>
              <span className={`inline-flex h-2 w-2 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.9)] ${isDemoMode ? 'bg-amber-400 shadow-amber-400/50' : 'bg-emerald-400'}`} />
              <span className={`text-[11px] font-mono uppercase tracking-widest ${isDemoMode ? 'text-amber-300' : 'text-emerald-300'}`}>
                {isDemoMode ? 'Demo Mode' : 'Link Online'}
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

