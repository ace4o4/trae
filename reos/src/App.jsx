import { Routes, Route } from 'react-router-dom'
import GuardDashboard from './GuardDashboard.jsx'
import ResidentApp from './ResidentApp.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Routes>
          <Route
            path="/guard"
            element={
              <ProtectedRoute>
                <GuardDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ResidentApp />} />
        </Routes>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
