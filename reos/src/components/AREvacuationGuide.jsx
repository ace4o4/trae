import { useEffect, useRef, useState } from 'react'
import { ArrowUp, X, AlertOctagon, Footprints } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AREvacuationGuide({ isOpen, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [hazardDetected, setHazardDetected] = useState(false)
  const [guideStep, setGuideStep] = useState(0)

  // Camera access
  useEffect(() => {
    let stream = null
    if (isOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then(videoStream => {
          stream = videoStream
          if (videoRef.current) videoRef.current.srcObject = stream
        })
        .catch(console.error)
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [isOpen])

  // Hazard Detection Logic (Simulated Fire Obstacle)
  useEffect(() => {
    if (!isOpen) return

    const checkHazard = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState !== 4) return

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(video, 0, 0, 64, 64)
      const data = ctx.getImageData(0, 0, 64, 64).data
      
      let redCount = 0
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 180 && data[i+1] < 100 && data[i+2] < 100) redCount++
      }
      
      // If significant red detected, block path
      setHazardDetected(redCount > 100)
    }

    const interval = setInterval(checkHazard, 500)
    return () => clearInterval(interval)
  }, [isOpen])

  // Simple "Nalu" Animation Sequence
  useEffect(() => {
    if(!isOpen) return
    const interval = setInterval(() => {
       setGuideStep(prev => (prev + 1) % 4)
    }, 1000)
    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black">
      {/* Camera Feed */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* AR Overlay Layer */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none perspective-[1000px] overflow-hidden">
         
         {/* Floor Plane */}
         <div className="relative h-full w-full rotate-x-60 transform-style-3d flex flex-col items-center justify-end pb-20 gap-20 opacity-80">
            
            {/* Dynamic Path Arrows */}
            {!hazardDetected ? (
               <>
                 {[0, 1, 2].map((i) => (
                    <motion.div
                       key={i}
                       initial={{ opacity: 0, y: 50 }}
                       animate={{ opacity: [0, 1, 0], y: -100 }}
                       transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                       className="flex flex-col items-center"
                    >
                       <div className="h-32 w-16 bg-gradient-to-t from-emerald-500/20 to-emerald-400 clipped-arrow mb-2 backdrop-blur-sm border-2 border-emerald-400/50 shadow-[0_0_30px_rgba(52,211,153,0.6)]" 
                            style={{ clipPath: 'polygon(20% 100%, 80% 100%, 80% 40%, 100% 40%, 50% 0%, 0% 40%, 20% 40%)' }} 
                       />
                       <span className="text-emerald-300 font-black text-4xl tracking-tighter drop-shadow-lg">EXIT</span>
                    </motion.div>
                 ))}
               </>
            ) : (
                <div className="flex flex-col items-center animate-pulse">
                   <div className="h-4 w-full bg-red-500/50 blur-xl absolute bottom-0" />
                   <AlertOctagon className="h-40 w-40 text-red-500 drop-shadow-[0_0_50px_rgba(239,68,68,1)]" />
                   <div className="bg-red-600 text-white px-6 py-2 font-black text-2xl uppercase tracking-widest mt-4 rotate-x-0">
                      DANGER • TURN BACK
                   </div>
                </div>
            )}

         </div>
      </div>

      {/* "Nalu" The Robot Guide */}
      <motion.div 
         animate={{ 
            y: [0, -10, 0],
            rotate: hazardDetected ? [0, -5, 5, 0] : 0
         }}
         transition={{ duration: 2, repeat: Infinity }}
         className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
      >
         <div className="relative h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.4)] border-4 border-slate-200">
            <div className="absolute top-6 flex gap-4 w-full justify-center">
               <div className={`h-3 w-3 rounded-full bg-slate-800 ${hazardDetected ? 'animate-bounce' : ''}`} />
               <div className={`h-3 w-3 rounded-full bg-slate-800 ${hazardDetected ? 'animate-bounce' : ''}`} />
            </div>
            {/* Mouth */}
            <div className={`mt-4 h-2 w-8 rounded-full bg-slate-800 ${hazardDetected ? 'h-4 w-4 rounded-full' : ''}`} />
            
            {/* Antennas */}
            <div className="absolute -top-4 left-4 h-6 w-1 bg-slate-300 -rotate-12" />
            <div className="absolute -top-4 right-4 h-6 w-1 bg-slate-300 rotate-12" />
            <div className="absolute -top-6 left-3 h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
         </div>
         
         <div className="mt-4 bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-xl border border-slate-700 font-mono text-sm">
            {hazardDetected ? "⚠️ FIRE DETECTED! Find another way!" : "Follow me! The exit is this way."}
         </div>
      </motion.div>

      {/* UI Controls */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={onClose}
          className="rounded-full bg-black/60 p-3 text-white backdrop-blur-md hover:bg-slate-800 border border-slate-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="absolute bottom-10 inset-x-0 flex justify-center z-50">
         <div className="bg-emerald-500 text-slate-900 px-6 py-3 rounded-full font-bold flex items-center gap-3 shadow-xl">
            <Footprints className="h-5 w-5" />
            <span>EVACUATION MODE ACTIVE</span>
         </div>
      </div>
    </div>
  )
}
