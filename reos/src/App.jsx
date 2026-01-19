import { Routes, Route } from 'react-router-dom'
import GuardDashboard from './GuardDashboard.jsx'
import ResidentApp from './ResidentApp.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
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
  )
}

export default App
