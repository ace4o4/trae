import { Component } from 'react'
import { HeartPulse, Activity } from 'lucide-react'

function formatTime(value) {
  if (!value) return ''
  try {
    const date = new Date(value)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function AlertLog({ alerts, onResolve }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-cyan-500/40 bg-slate-950/80 p-4 shadow-[0_0_40px_rgba(15,23,42,0.9)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Active alerts
          </h2>
          <p className="text-[11px] text-slate-500">
            Stream updates in real time
          </p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300">
            Link
          </span>
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto pr-1 text-xs">
        {alerts.length === 0 && (
          <div className="rounded-md border border-dashed border-slate-700 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-500">
            No active alerts
          </div>
        )}
        {alerts.map(alert => (
          <div
            key={alert.id}
            className="flex items-start justify-between gap-3 rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={[
                    'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest',
                    alert.type === 'Fire'
                      ? 'bg-red-600/20 text-red-400'
                      : alert.type === 'Security'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-cyan-500/20 text-cyan-300',
                  ].join(' ')}
                >
                  {alert.type || 'Unknown'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Flat {alert.flat || '---'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                {alert.residentName && (
                  <span className="mr-2 font-mono text-slate-300">
                    {alert.residentName}
                  </span>
                )}
                <span>{formatTime(alert.timestamp)}</span>

                {alert.vitals && (
                  <div className="mt-2 flex items-center gap-3 border-t border-slate-800 pt-1">
                    <div className="flex items-center gap-1 text-rose-400">
                      <HeartPulse className="h-3 w-3 animate-pulse" />
                      <span className="font-mono text-[10px]">{alert.vitals.heartRate} BPM</span>
                    </div>
                    <div className="flex items-center gap-1 text-sky-400">
                      <Activity className="h-3 w-3" />
                      <span className="font-mono text-[10px]">{alert.vitals.oxygen}% SpO2</span>
                    </div>
                  </div>
                )}

                {alert.evidenceImage && (
                  <div className="mt-2 overflow-hidden rounded-md border border-red-500/50 bg-red-950/30">
                     <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-900/50 border-b border-red-500/30">
                        Visual Evidence
                     </div>
                     <img src={alert.evidenceImage} alt="Alert Evidence" className="w-full h-auto object-cover opacity-90" />
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onResolve(alert.id)}
              className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-200 hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-200"
            >
              Resolved
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertLog

