import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, Flame, Shield, Scan, Wifi, Zap, Footprints } from 'lucide-react'
import { useEmergencySystem } from './hooks/useEmergencySystem.js'
import { useSensors } from './hooks/useSensors.js'
import CommunityFeed from './components/CommunityFeed.jsx'
import { useToast } from './context/ToastContext.jsx'
import FireDetectionOverlay from './components/FireDetectionOverlay.jsx'
import MeshNetworkSimulator from './components/MeshNetworkSimulator.jsx'
import AREvacuationGuide from './components/AREvacuationGuide.jsx'

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
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isScanOpen, setIsScanOpen] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [isAROpen, setIsAROpen] = useState(false)

  const triggerAlert = useCallback(
    async (type, evidenceImage = null) => {
      if (isProcessing) return
      setIsProcessing(true)

      const safeFlat = flat || DEFAULT_FLAT
      const safeName = name || 'Resident'
      const activeVitals = isWearableConnected ? {
        heartRate: Math.floor(80 + Math.random() * 60),
        oxygen: 98
      } : null

      try {
        await sendAlert(safeFlat, type, safeName, activeVitals, evidenceImage)
        toast({
          title: 'Alert Sent',
          description: 'Security team has been notified.',
          variant: 'destructive'
        })
      } catch (e) {
        toast({
            title: 'Connection Error',
            description: 'Trying fallback mode...',
            variant: 'destructive'
        })
      } finally {
        setTimeout(() => setIsProcessing(false), 2000)
      }
    },
    [flat, name, sendAlert, isWearableConnected, isProcessing, toast],
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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Ambient Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="relative mx-auto flex max-w-md flex-col gap-8 px-6 py-10">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/50 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
              REOS Secure Link
            </span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">{name || 'Resident'}</span>
            </h1>
            <p className="text-sm font-medium text-slate-400 max-w-[280px] mx-auto leading-relaxed">
              Everything is running smoothly. Tap below if you need immediate assistance.
            </p>
          </div>

          <button
            onClick={() => setIsScanOpen(true)}
            className="mx-auto flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 hover:bg-cyan-500/20 active:scale-95 transition-all"
          >
            <Scan className="h-4 w-4" />
            AI Smart Scan
          </button>
        </header>

        <section className="grid gap-4">
          <button
            type="button"
            onClick={() => triggerAlert('Medical')}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-6 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.1)] active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-cyan-950 transition-colors duration-300">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">Medical Help</div>
                <p className="text-xs font-medium text-slate-500 group-hover:text-slate-400">Ambulance, Fall Detection</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => triggerAlert('Fire')}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-6 transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(248,113,113,0.1)] active:scale-95"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20 group-hover:bg-red-500 group-hover:text-red-950 transition-colors duration-300">
                <Flame className="h-7 w-7" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-lg font-bold text-slate-100 group-hover:text-red-400 transition-colors">Fire Emergency</div>
                <p className="text-xs font-medium text-slate-500 group-hover:text-slate-400">Smoke, Gas Leak</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => triggerAlert('Security')}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-6 transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] active:scale-95"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 group-hover:bg-amber-500 group-hover:text-amber-950 transition-colors duration-300">
                <Shield className="h-7 w-7" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors">Security Alert</div>
                <p className="text-xs font-medium text-slate-500 group-hover:text-slate-400">Intruder, Threat</p>
              </div>
            </div>
          </button>
        </section>

        <section className="rounded-3xl border border-slate-800/60 bg-slate-900/30 p-6 backdrop-blur-xl">
           <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Settings</h3>
              <div className={`h-2 w-2 rounded-full ${isWearableConnected ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-700'}`} />
           </div>
           
           <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-400">Flat No.</label>
                  <input
                    type="text"
                    value={flat}
                    onChange={e => setFlat(e.target.value)}
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-950/50 px-4 py-2.5 text-sm font-medium text-slate-200 focus:border-cyan-500/50 focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
                    placeholder="302"
                  />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-medium text-slate-400">Your Name</label>
                   <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-950/50 px-4 py-2.5 text-sm font-medium text-slate-200 focus:border-cyan-500/50 focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
                    placeholder="Resident"
                  />
                </div>
             </div>

             <div className="flex gap-3">
                <button
                  onClick={() => setIsWearableConnected(!isWearableConnected)}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${isWearableConnected ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400' : 'border-slate-700/50 hover:bg-slate-800 text-slate-400'}`}
                >
                  {isWearableConnected ? 'Watch Paired' : 'Pair Watch'}
                </button>
                <button
                  onClick={async () => {
                     if (isListening) stopListening()
                     else {
                         const granted = await requestAccess()
                         if(granted) startListening()
                         else alert('Permission required')
                     }
                  }}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${isListening ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-slate-700/50 hover:bg-slate-800 text-slate-400'}`}
                >
                  {isListening ? 'Sensors Active' : 'Enable Sensors'}
                </button>
             </div>
           </div>
        </section>

        <CommunityFeed />

        <footer className="mt-8 text-center">
          <a 
            href="/guard" 
            className="text-[10px] uppercase tracking-widest text-slate-700 hover:text-cyan-500 transition-colors"
          >
            Restricted Access
          </a>
        </footer>
      </div>

      <FireDetectionOverlay 
        isOpen={isScanOpen} 
        onClose={() => setIsScanOpen(false)} 
        onFireDetected={(snapshot) => triggerAlert('Fire', snapshot)} 
      />

      <MeshNetworkSimulator 
         isOpen={false} 
         isOffline={isOffline} 
         onClose={() => setIsOffline(false)} 
      />

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={() => setIsOffline(!isOffline)}
          className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-lg transition-all ${isOffline ? 'bg-amber-500 text-slate-900 border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
          title="Toggle Offline Mesh"
        >
           {isOffline ? <Zap className="h-5 w-5 fill-current" /> : <Wifi className="h-5 w-5" />}
        </button>
         
        <button
          onClick={() => setIsAROpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-lg transition-all hover:bg-emerald-500 hover:text-slate-900"
          title="Start AR Evacuation"
        >
           <Footprints className="h-5 w-5" />
        </button>
      </div>

      <AREvacuationGuide 
        isOpen={isAROpen} 
        onClose={() => setIsAROpen(false)} 
      />
    </div>
  )
}

export default ResidentApp

