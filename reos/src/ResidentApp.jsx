import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, Flame, Shield } from 'lucide-react'
import { useEmergencySystem } from './hooks/useEmergencySystem.js'
import { useSensors } from './hooks/useSensors.js'
import CommunityFeed from './components/CommunityFeed.jsx'

const DEFAULT_FLAT = '302'

function ResidentApp() {
  const { sendAlert } = useEmergencySystem()
  const [flat, setFlat] = useState(() => localStorage.getItem('reos_flat') || DEFAULT_FLAT)
  const [name, setName] = useState(() => localStorage.getItem('reos_name') || '')

  useEffect(() => {
    localStorage.setItem('reos_flat', flat)
  }, [flat])

  useEffect(() => {
    localStorage.setItem('reos_name', name)
  }, [name])




  const [isWearableConnected, setIsWearableConnected] = useState(false)

  const triggerAlert = useCallback(
    type => {
      const safeFlat = flat || DEFAULT_FLAT
      const safeName = name || 'Resident'
      const activeVitals = isWearableConnected ? {
        heartRate: Math.floor(80 + Math.random() * 60),
        oxygen: 98
      } : null

      sendAlert(safeFlat, type, safeName, activeVitals)
    },
    [flat, name, sendAlert, isWearableConnected],
  )

  const handleSensorTrigger = useCallback(
    source => {
      const type = source === 'fall' ? 'Medical' : 'Security'
      triggerAlert(type)
    },
    [triggerAlert],
  )

  const { isListening, startListening, stopListening, requestAccess } = useSensors(
    handleSensorTrigger,
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-8">
        <header className="space-y-2 text-center">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-cyan-400">
            REOS Emergency Link
          </p>
          <h1 className="text-xl font-semibold text-slate-50">
            Tap once when you need help
          </h1>
          <p className="text-xs text-slate-500">
            Hold your phone nearby. Voice and fall detection stay armed in the background.
          </p>
        </header>

        <CommunityFeed />

        <section className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-1">
            <span className="text-xs font-semibold text-slate-400">Device Status</span>
            <button
              onClick={() => setIsWearableConnected(!isWearableConnected)}
              className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded border transition-colors ${isWearableConnected ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
            >
              {isWearableConnected ? 'Watch Connected' : 'Connect Watch'}
            </button>
          </div>
          <div className="grid gap-3 text-xs text-slate-300 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Flat
              </span>
              <input
                type="text"
                value={flat}
                onChange={event => setFlat(event.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500"
                placeholder="302"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Name
              </span>
              <input
                type="text"
                value={name}
                onChange={event => setName(event.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500"
                placeholder="Resident"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (isListening) {
                stopListening()
              } else {
                const granted = await requestAccess()
                if (granted) {
                  startListening()
                } else {
                  alert('Sensor permission is required for fall detection.')
                }
              }
            }}
            className={[
              'mt-1 inline-flex items-center justify-center gap-2 rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-widest',
              isListening
                ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200'
                : 'border-slate-700 bg-slate-900 text-slate-400',
            ].join(' ')}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            {isListening ? 'Sensors Armed' : 'Arm Sensors'}
          </button>
        </section>
        <section className="grid gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => triggerAlert('Medical')}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-cyan-500/40 bg-slate-900/80 px-4 py-6 text-center shadow-[0_0_30px_rgba(34,211,238,0.3)] transition hover:border-cyan-400 hover:bg-slate-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-500/40">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold uppercase tracking-widest">
                Medical
              </div>
              <p className="text-[11px] text-slate-400">
                Heart, fall, breathing, unconscious
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => triggerAlert('Fire')}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-500/40 bg-slate-900/80 px-4 py-6 text-center shadow-[0_0_30px_rgba(248,113,113,0.3)] transition hover:border-red-400 hover:bg-slate-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-300 group-hover:bg-red-500/40">
              <Flame className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold uppercase tracking-widest">
                Fire
              </div>
              <p className="text-[11px] text-slate-400">
                Smoke, gas leak, fire sighted
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => triggerAlert('Security')}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-amber-500/40 bg-slate-900/80 px-4 py-6 text-center shadow-[0_0_30px_rgba(245,158,11,0.3)] transition hover:border-amber-400 hover:bg-slate-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-200 group-hover:bg-amber-500/40">
              <Shield className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold uppercase tracking-widest">
                Security
              </div>
              <p className="text-[11px] text-slate-400">
                Threat, trespass, assault, disturbance
              </p>
            </div>
          </button>
        </section>
      </div>
    </div>
  )
}

export default ResidentApp

