import { useCallback, useEffect, useRef, useState } from 'react'

const FALL_THRESHOLD = 25
const FALL_DEBOUNCE_MS = 3000

export function useSensors(onTrigger) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)
  const lastFallRef = useRef(0)

  useEffect(() => {
    const handleMotion = event => {
      const acceleration = event.acceleration || event.accelerationIncludingGravity
      if (!acceleration) return

      const x = acceleration.x || 0
      const y = acceleration.y || 0
      const z = acceleration.z || 0

      const magnitude = Math.sqrt(x * x + y * y + z * z)
      const now = Date.now()

      if (magnitude > FALL_THRESHOLD && now - lastFallRef.current > FALL_DEBOUNCE_MS) {
        lastFallRef.current = now
        onTrigger('fall')
      }
    }

    window.addEventListener('devicemotion', handleMotion)

    return () => {
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [onTrigger])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null
      recognitionRef.current.onend = null
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) return

    if (recognitionRef.current) {
      stopListening()
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ')
        .toLowerCase()

      if (
        transcript.includes('help') ||
        transcript.includes('fire') ||
        transcript.includes('emergency')
      ) {
        onTrigger('voice')
      }
    }

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
    recognitionRef.current = recognition
  }, [onTrigger, stopListening])

  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [stopListening])

  const requestAccess = useCallback(async () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission()
        return permissionState === 'granted'
      } catch (error) {
        console.error('Sensor permission denied:', error)
        return false
      }
    }
    return true
  }, [])

  return {
    isListening,
    startListening,
    stopListening,
    requestAccess,
  }
}

