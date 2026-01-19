import { useEffect, useState } from 'react'
import { Bot, Sparkles } from 'lucide-react'

const MOCK_SUMMARIES = {
    Medical: [
        'Analyzing sensor data... High probability of fall detected in living room area. Resident heart rate elevated. Recommend immediate dispatch of medical assistance.',
        'Bio-monitor reading abnormal. sudden deceleration event consistent with slipping. Subject stationary. Priority: HIGH.',
    ],
    Fire: [
        'Thermal runaway detected. Temperature accumulation rate exceeds safety thresholds. Smoke density increasing. Auto-dialing fire department...',
        'Particulate matter sensor abnormal. Heat signature detected in kitchen module. Sprinkler systems on standby. Evacuation recommended.',
    ],
    Security: [
        'Perimeter breach detected. Unverified entry at primary access point. Facial recognition failed. Locking down sector 4.',
        'Acoustic sensor triggered: Glass break pattern identified. Motion detected in restricted zone. Security personnel dispatched.',
    ],
}

export default function AIAlertSummary({ latestAlert }) {
    const [typedText, setTypedText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        if (!latestAlert) return

        const summaries = MOCK_SUMMARIES[latestAlert.type] || ['Analyzing anomaly... data insufficient. Manual verification required.']
        const text = summaries[Math.floor(Math.random() * summaries.length)]

        setTypedText('')
        setIsTyping(true)

        let i = 0
        const interval = setInterval(() => {
            setTypedText(text.slice(0, i + 1))
            i++
            if (i > text.length) {
                clearInterval(interval)
                setIsTyping(false)
            }
        }, 30) // Typing speed

        return () => clearInterval(interval)
    }, [latestAlert])

    if (!latestAlert) return null

    return (
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center gap-2">
                <Bot className="h-5 w-5 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                    Reos AI Analysis
                </span>
                {isTyping && (
                    <Sparkles className="h-4 w-4 animate-pulse text-cyan-200" />
                )}
            </div>
            <div className="font-mono text-xs leading-relaxed text-cyan-100/90 h-16">
                {typedText}
                {isTyping && <span className="animate-pulse">_</span>}
            </div>
        </div>
    )
}
