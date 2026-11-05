import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import './index.css'
import {ThemeProvider} from './context/ThemeContext.jsx'

// Public pages
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Onboarding from './pages/Onboarding.jsx'

// Authenticated student pages
import Dashboard from './pages/Dashboard.jsx'
import CareerAssessment from './pages/CareerAssessment.jsx'
import Roadmap from './pages/Roadmap.jsx'
import Resume from './pages/Resume.jsx'
import JobMatch from './pages/JobMatch.jsx'
import SkillAssessment from './pages/SkillAssessment.jsx'
import MockInterview from './pages/MockInterview.jsx'
import Mentor from './pages/Mentor.jsx'
import Projects from './pages/Projects.jsx'
import Jobs from './pages/Jobs.jsx'
import Notifications from './pages/Notifications.jsx'
import Profile from './pages/Profile.jsx'

// Admin pages
import AdminLogin from './pages/AdminLogin.jsx'
import AdminApp from './pages/AdminApp.jsx'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Semi-protected: onboarding after register */}
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

      {/* Authenticated student routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/career-assessment" element={<ProtectedRoute><CareerAssessment /></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
      <Route path="/job-match" element={<ProtectedRoute><JobMatch /></ProtectedRoute>} />
      <Route path="/skill-assessment" element={<ProtectedRoute><SkillAssessment /></ProtectedRoute>} />
      <Route path="/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
      <Route path="/mentor" element={<ProtectedRoute><Mentor /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminApp />} />
      <Route path="/admin/*" element={<AdminApp />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
