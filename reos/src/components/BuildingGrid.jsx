import { memo, useMemo } from 'react'

function buildFlats() {
  const floors = []
  for (let floor = 1; floor <= 10; floor += 1) {
    const flats = []
    for (let unit = 1; unit <= 4; unit += 1) {
      const flat = `${floor}${String(unit).padStart(2, '0')}`
      flats.push({ floor, unit, flat })
    }
    floors.push({ floor, flats })
  }
  return floors
}

const allFloors = buildFlats()

function BuildingGrid({ activeAlerts }) {
  const activeFlats = useMemo(
    () => new Set(activeAlerts.map(alert => String(alert.flat))),
    [activeAlerts],
  )

  return (
    <div className="relative flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/50 p-8 shadow-2xl backdrop-blur-2xl overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.1),transparent_70%)]" />
      <div className="absolute top-0 right-0 p-4 opacity-50">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-500">System Online</span>
        </div>
      </div>

      <div className="z-10 mb-6 flex items-baseline justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-widest text-slate-100">
            Tower A <span className="text-slate-600">//</span> Sector 4
          </h2>
          <p className="text-[11px] font-medium text-slate-500">
            Live Structural Integrity Monitoring
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-light text-cyan-400">
            {Math.floor(Date.now() / 1000) % 100}%
          </div>
          <div className="text-[10px] font-mono uppercase text-slate-600">Load Capacity</div>
        </div>
      </div>

      <div className="z-10 grid gap-3 perspective-[1000px]">
        {allFloors
          .slice()
          .reverse()
          .map(row => (
            <div
              key={row.floor}
              className="group relative flex items-center gap-4 transition-all hover:translate-x-2"
            >
              <div className="w-12 text-right text-xs font-bold text-slate-600 group-hover:text-cyan-400 transition-colors">
                Lvl {String(row.floor).padStart(2, '0')}
              </div>

              <div className="relative flex-1">
                {/* Connecting Line */}
                <div className="absolute top-1/2 -left-4 w-4 h-[1px] bg-slate-800 group-hover:bg-cyan-900/50 transition-colors" />

                <div className="grid grid-cols-4 gap-3">
                  {row.flats.map(cell => {
                    const hasAlert = activeFlats.has(cell.flat)
                    return (
                      <div
                        key={cell.flat}
                        className={[
                          'relative h-14 overflow-hidden rounded-md border text-[10px] font-mono transition-all duration-500',
                          hasAlert
                            ? 'scale-105 border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.4)] z-10'
                            : 'border-slate-800 bg-slate-900/40 opacity-60 hover:border-cyan-500/30 hover:bg-cyan-950/30 hover:opacity-100',
                        ].join(' ')}
                      >
                        {/* Status Indicator */}
                        <div className={[
                          'absolute top-2 right-2 h-1.5 w-1.5 rounded-full',
                          hasAlert ? 'bg-red-500 animate-ping' : 'bg-emerald-500/20'
                        ].join(' ')} />

                        <div className="flex h-full flex-col items-center justify-center gap-1">
                          <span className={hasAlert ? 'text-red-200 font-bold' : 'text-slate-500'}>
                            {cell.flat}
                          </span>
                          {hasAlert && (
                            <span className="animate-pulse text-[9px] uppercase tracking-wider text-red-400">
                              Critical
                            </span>
                          )}
                        </div>

                        {/* Scanline Effect for Alert */}
                        {hasAlert && (
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent animate-scan" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default memo(BuildingGrid)

