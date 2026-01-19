import { useCallback, useEffect, useMemo, useState } from 'react'
import { onValue, push, ref, update } from 'firebase/database'
import { db } from '../lib/firebase'

const ALERTS_PATH = 'alerts'

export function useEmergencySystem() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    if (!db) {
      // Mock mode: No-op for listener or setup mock interval if needed
      return
    }
    const alertsRef = ref(db, ALERTS_PATH)

    const unsubscribe = onValue(alertsRef, snapshot => {
      const value = snapshot.val() || {}
      const list = Object.entries(value).map(([id, alert]) => ({
        id,
        ...alert,
      }))
      list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      setAlerts(list)
    })

    return () => unsubscribe()
  }, [])

  const sendAlert = useCallback((flat, type, residentName, vitals) => {
    if (!db) {
      // Mock Update
      const newAlert = {
        id: Date.now().toString(),
        flat,
        type,
        status: 'Active',
        residentName: residentName || 'Unknown',
        vitals,
        timestamp: Date.now(),
      }
      setAlerts(prev => [newAlert, ...prev])
      return Promise.resolve()
    }

    const alertsRef = ref(db, ALERTS_PATH)
    const payload = {
      flat,
      type,
      status: 'Active',
      residentName: residentName || 'Unknown',
      vitals: vitals || null,
      timestamp: Date.now(),
    }
    return push(alertsRef, payload)
  }, [])

  const resolveAlert = useCallback(id => {
    if (!db) {
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === id ? { ...alert, status: 'Resolved' } : alert,
        ),
      )
      return Promise.resolve()
    }

    const alertRef = ref(db, `${ALERTS_PATH}/${id}`)
    return update(alertRef, { status: 'Resolved' })
  }, [])

  const activeAlerts = useMemo(
    () => alerts.filter(alert => alert.status === 'Active'),
    [alerts],
  )

  return {
    alerts,
    activeAlerts,
    sendAlert,
    resolveAlert,
  }
}

