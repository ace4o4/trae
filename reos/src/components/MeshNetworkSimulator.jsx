import { useEffect, useState, useRef } from 'react'
import { Wifi, WifiOff, Zap, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MeshNetworkSimulator({ isOpen, onClose, isOffline }) {
  const [nodes, setNodes] = useState([])
  const [signals, setSignals] = useState([])
  const [showNetwork, setShowNetwork] = useState(false)

  // Initialize random nodes positions
  useEffect(() => {
    if (isOpen) {
      const newNodes = Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        x: 20 + Math.random() * 60, // % position
        y: 20 + Math.random() * 60,
        delay: i * 0.2
      }))
      setNodes(newNodes)
      setShowNetwork(true)
      
      // Simulate signal hops
      const interval = setInterval(() => {
        const startNode = Math.floor(Math.random() * newNodes.length)
        let endNode = Math.floor(Math.random() * newNodes.length)
        while(endNode === startNode) endNode = Math.floor(Math.random() * newNodes.length)
        
        const signalId = Date.now()
        setSignals(prev => [...prev, { id: signalId, start: newNodes[startNode], end: newNodes[endNode] }])
        
        // Remove signal after animation
        setTimeout(() => {
          setSignals(prev => prev.filter(s => s.id !== signalId))
        }, 1000)
      }, 800)

      return () => clearInterval(interval)
    } else {
      setShowNetwork(false)
      setSignals([])
    }
  }, [isOpen])

  if (!isOpen && !isOffline) return null

  return (
    <AnimatePresence>
      {(isOpen || isOffline) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-4 right-4 left-4 z-40 overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl sm:left-auto sm:w-80"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isOffline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                {isOffline ? <WifiOff className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">
                  REOS Mesh
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">
                  {isOffline ? 'P2P PROTOCOL ACTIVE' : 'Standby Mode'}
                </p>
              </div>
            </div>
            {isOffline && (
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>

          {/* Visualization Area */}
          <div className="relative h-40 w-full rounded-lg bg-slate-950/50 border border-slate-800/50 overflow-hidden">
             
             {/* Nodes */}
             {nodes.map((node) => (
                <motion.div
                  key={node.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: node.delay }}
                  className="absolute h-3 w-3 -ml-1.5 -mt-1.5 rounded-full bg-slate-700 border border-slate-600 z-10 flex items-center justify-center"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <Smartphone className="h-2 w-2 text-slate-400" />
                </motion.div>
             ))}

             {/* Connection Lines (Static Topology) */}
             <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-20">
               {nodes.map((node, i) => (
                 nodes.slice(i + 1).map((target, j) => (
                   <line 
                    key={`${i}-${j}`}
                    x1={`${node.x}%`} 
                    y1={`${node.y}%`} 
                    x2={`${target.x}%`} 
                    y2={`${target.y}%`} 
                    stroke="currentColor" 
                    strokeWidth="1"
                    className="text-slate-500"
                   />
                 ))
               ))}
             </svg>

             {/* Active Signals */}
             <svg className="absolute inset-0 h-full w-full pointer-events-none z-20">
               {signals.map(signal => (
                 <motion.circle
                   key={signal.id}
                   r="3"
                   fill="#34d399" // emerald-400
                   initial={{ cx: `${signal.start.x}%`, cy: `${signal.start.y}%` }}
                   animate={{ cx: `${signal.end.x}%`, cy: `${signal.end.y}%` }}
                   transition={{ duration: 0.5, ease: "linear" }}
                 />
               ))}
             </svg>

             {/* Signal Effects */}
             <AnimatePresence>
                {signals.map(signal => (
                    <motion.div
                       key={`pulse-${signal.id}`}
                       initial={{ opacity: 1, scale: 0 }}
                       animate={{ opacity: 0, scale: 2 }}
                       exit={{ opacity: 0 }}
                       transition={{ duration: 0.5, delay: 0.5 }}
                       className="absolute h-8 w-8 -ml-4 -mt-4 rounded-full border border-emerald-500/50"
                       style={{ left: `${signal.end.x}%`, top: `${signal.end.y}%` }}
                    />
                ))}
             </AnimatePresence>
          </div>

          <div className="mt-2 text-[9px] text-slate-500 text-center font-mono">
            {isOffline 
              ? `Route found via Node #${Math.floor(Math.random() * 1000)} • 24ms latency`
              : 'Monitoring connectivity...'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
