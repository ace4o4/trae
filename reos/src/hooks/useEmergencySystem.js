import { useCallback, useEffect, useMemo, useState } from 'react'
import { onValue, push, ref, update } from 'firebase/database'
import { db } from '../lib/firebase'

const ALERTS_PATH = 'alerts'

export function useEmergencySystem() {
  const [alerts, setAlerts] = useState([])
  const [demoMode, setDemoMode] = useState(false)

  // Initial check for Firebase connection
  useEffect(() => {
    if (!db) {
      setDemoMode(true)
      return
    }
    const alertsRef = ref(db, ALERTS_PATH)
    
    // Safety timeout - if Firebase doesn't respond in 3s, switch to demo mode
    const timeout = setTimeout(() => {
        if (alerts.length === 0) setDemoMode(true)
    }, 3000)

    try {
        const unsubscribe = onValue(alertsRef, snapshot => {
            clearTimeout(timeout)
            const value = snapshot.val() || {}
            const list = Object.entries(value).map(([id, alert]) => ({
                id,
                ...alert,
            }))
            list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            setAlerts(list)
            setDemoMode(false) // Connected successfully
        }, (error) => {
            console.error("Firebase error, switching to demo mode:", error)
            setDemoMode(true)
        })

        return () => {
            clearTimeout(timeout)
            unsubscribe()
        }
    } catch (e) {
        console.error("Firebase setup error:", e)
        setDemoMode(true)
    }
  }, [])

  const sendAlert = useCallback(async (flat, type, residentName = '', vitals = null, evidenceImage = null) => {
    const payload = {
      flat,
      type,
      residentName,
      vitals,
      evidenceImage,
      timestamp: Date.now(),
      status: 'active',
    }

    if (demoMode || !db) {
      const newAlert = {
        id: Date.now().toString(),
        ...payload
      }
      setAlerts(prev => [newAlert, ...prev])
      return Promise.resolve()
    }

    try {
        const alertsRef = ref(db, ALERTS_PATH)
        return push(alertsRef, payload).catch(e => {
            console.error("Send alert failed, fallback to local:", e)
            // Fallback to local state if push fails
            const newAlert = { id: Date.now().toString(), ...payload }
            setAlerts(prev => [newAlert, ...prev])
        })
    } catch (e) {
        // Immediate fallback
        const newAlert = { id: Date.now().toString(), ...payload }
        setAlerts(prev => [newAlert, ...prev])
        return Promise.resolve()
    }
  }, [demoMode])

  const resolveAlert = useCallback(id => {
    if (demoMode || !db) {
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === id ? { ...alert, status: 'Resolved' } : alert,
        ),
      )
      return Promise.resolve()
    }

    try {
        const alertRef = ref(db, `${ALERTS_PATH}/${id}`)
        return update(alertRef, { status: 'Resolved' }).catch(e => {
            console.error("Resolve failed, doing locally:", e)
            setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a))
        })
    } catch (e) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a))
        return Promise.resolve()
    }
  }, [demoMode])

  const activeAlerts = useMemo(
    () => alerts.filter(alert => alert.status === 'Active'),
    [alerts],
  )

  return {
    alerts,
    activeAlerts,
    sendAlert,
    resolveAlert,
    isDemoMode: demoMode
  }
}

