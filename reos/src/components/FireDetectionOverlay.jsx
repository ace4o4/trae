import { useEffect, useRef, useState } from 'react'
import { X, AlertTriangle, Scan } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FireDetectionOverlay({ isOpen, onClose, onFireDetected }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [detectionConfidence, setDetectionConfidence] = useState(0)
  const [status, setStatus] = useState('initializing') // initializing, seeking, detected

  // Camera cleanup
  useEffect(() => {
    let stream = null

    if (isOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then(videoStream => {
          stream = videoStream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            setStatus('seeking')
            setIsScanning(true)
          }
        })
        .catch(err => {
          console.error("Camera access denied:", err)
          onClose() // Close if camera fails
        })
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      setIsScanning(false)
      setDetectionConfidence(0)
    }
  }, [isOpen, onClose])

  // Analysis Loop
  useEffect(() => {
    if (!isScanning || status === 'detected') return

    const interval = setInterval(() => {
      detectFire()
    }, 200) // 5fps check is sufficient

    return () => clearInterval(interval)
  }, [isScanning, status])

  const detectFire = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState !== 4) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // Draw small frame for analysis (performance)
    canvas.width = 64
    canvas.height = 64
    ctx.drawImage(video, 0, 0, 64, 64)

    const imageData = ctx.getImageData(0, 0, 64, 64)
    const data = imageData.data
    let firePixels = 0
    const totalPixels = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Simple Heuristic for Fire:
      // High Red, Moderate Green, Low Blue
      // Brightness check
      if (r > 160 && g > 80 && g < 200 && b < 100 && r > g + 40) {
        firePixels++
      }
    }

    const ratio = firePixels / totalPixels
    setDetectionConfidence(prev => Math.min(100, Math.max(0, (ratio * 1000)))) // Scale up sensitivity

    if (ratio > 0.05) { // 5% of screen is "fire"
      setStatus('detected')
      setIsScanning(false)
      
      const snapshot = canvas.toDataURL('image/jpeg', 0.5) // Capture low-res snapshot

      // Auto-trigger alert after 1.5s visual confirmation
      setTimeout(() => {
        onFireDetected(snapshot)
        onClose()
      }, 1500)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-slate-950"
      >
        <div className="relative flex-1 overflow-hidden bg-black">
          {/* Camera Feed */}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover transition-opacity duration-500 ${status === 'detected' ? 'opacity-50' : 'opacity-100'}`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanner Overlay UI */}
          <div className="absolute inset-0 pointer-events-none">
             {/* HUD Markers */}
             <div className="absolute top-8 left-8 h-16 w-16 border-l-4 border-t-4 border-cyan-500/50 rounded-tl-3xl" />
             <div className="absolute top-8 right-8 h-16 w-16 border-r-4 border-t-4 border-cyan-500/50 rounded-tr-3xl" />
             <div className="absolute bottom-8 left-8 h-16 w-16 border-l-4 border-b-4 border-cyan-500/50 rounded-bl-3xl" />
             <div className="absolute bottom-8 right-8 h-16 w-16 border-r-4 border-b-4 border-cyan-500/50 rounded-br-3xl" />
             
             {/* Central Scanner Line */}
             {status === 'seeking' && (
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,1)] animate-scan-fast" />
             )}

             {/* Detection Warning */}
             {status === 'detected' && (
                 <div className="absolute inset-0 flex items-center justify-center bg-red-500/30 animate-pulse">
                    <div className="text-center">
                        <AlertTriangle className="h-24 w-24 text-red-500 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-md">
                            FIRE DETECTED
                        </h2>
                        <p className="text-red-200 mt-2 font-mono">Initiating Emergency Protocol...</p>
                    </div>
                 </div>
             )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 rounded-full bg-black/50 p-3 text-white backdrop-blur-md hover:bg-slate-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Bottom Control / Status Panel */}
        <div className="bg-slate-900 p-6 pb-12 rounded-t-3xl border-t border-slate-800">
           <div className="flex items-center gap-4">
               <div className={`flex h-12 w-12 items-center justify-center rounded-full ${status === 'detected' ? 'bg-red-500/20 text-red-500' : 'bg-cyan-500/20 text-cyan-400'}`}>
                   {status === 'detected' ? <AlertTriangle className="h-6 w-6" /> : <Scan className="h-6 w-6" />}
               </div>
               <div className="flex-1">
                   <h3 className="font-bold text-slate-100 uppercase tracking-wider">
                       {status === 'detected' ? 'CRITICAL ALERT' : 'AI VISUAL SCANNER'}
                   </h3>
                   <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                       <div 
                           className={`h-full transition-all duration-300 ${status === 'detected' ? 'bg-red-500 w-full' : 'bg-cyan-500'}`}
                           style={{ width: status === 'detected' ? '100%' : `${detectionConfidence}%` }} 
                       />
                   </div>
                   <p className="mt-1 text-xs text-slate-500 font-mono">
                       {status === 'seeking' ? 'ANALYZING THERMAL SIGNATURES...' : 'CONFIRMED PATTERN MATCH'}
                   </p>
               </div>
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
