import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { ReportForm } from './pages/ReportForm'
import { Dashboard } from './pages/Dashboard'
import { formatHebrewDateTime } from './utils/hebrew'

function Navigation() {
  const location = useLocation()
  
  return (
    <div className="bg-blue-600 text-white p-6 shadow-lg">
      <h1 className="text-3xl font-bold text-center">
        מערכת מעקב בדיקות הנדסיות
      </h1>
      <h2 className="text-xl text-blue-100 text-center mt-2">
        קריית התקשוב - מרכז נתונים ראשי
      </h2>
      <p className="text-blue-200 text-center mt-1">
        {formatHebrewDateTime(new Date())}
      </p>
      
      {/* Navigation Links */}
      <div className="flex justify-center gap-4 mt-4">
        <Link 
          to="/report" 
          className={`px-4 py-2 rounded-lg transition-colors ${
            location.pathname === '/report' 
              ? 'bg-blue-800 text-white' 
              : 'bg-blue-500 hover:bg-blue-700 text-blue-100'
          }`}
        >
          דיווח טכנאי
        </Link>
        <Link 
          to="/dashboard" 
          className={`px-4 py-2 rounded-lg transition-colors ${
            location.pathname === '/dashboard' 
              ? 'bg-blue-800 text-white' 
              : 'bg-blue-500 hover:bg-blue-700 text-blue-100'
          }`}
        >
          דשבורד מנהל
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 rtl-container hebrew-font">
        <Navigation />
        
        <Routes>
          <Route path="/report" element={<ReportForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
