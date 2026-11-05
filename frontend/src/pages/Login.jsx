import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, ArrowRight, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { Alert } from '../components/ui.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    try {
      await login({ email: fd.get('email'), password: fd.get('password') })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-white text-slate-900 font-['Inter'] antialiased selection:bg-indigo-500/30 dark:bg-[#06070f] dark:text-slate-100 transition-colors duration-300">
      
      {/* Background Effects - only visible in dark mode */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)] opacity-0 transition-opacity duration-500 dark:opacity-100" />
        <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/0 blur-[100px] transition-colors duration-500 dark:bg-indigo-600/30" />
        <div className="absolute top-20 right-0 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/0 blur-[100px] transition-colors duration-500 dark:bg-fuchsia-600/20" />
      </div>

      {/* Theme Toggle - Top Right */}
      <div className="absolute right-6 top-6 z-50">
        <ThemeToggle />
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp .7s cubic-bezier(.2,.9,.3,1) both; }
        .d1{animation-delay:.06s}.d2{animation-delay:.12s}.d3{animation-delay:.18s}
        .d4{animation-delay:.24s}.d5{animation-delay:.3s}

        .auth-field { position: relative; transition: all .3s ease; }
        .auth-field:focus-within { transform: translateY(-1px); }
        
        .auth-field input {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: .85rem;
          padding: .9rem 1rem .9rem 2.85rem;
          color: #0f172a;
          font-size: .9rem;
          outline: none;
          transition: all .3s ease;
        }
        .dark .auth-field input {
          background: rgba(255,255,255,.04);
          border-color: rgba(255,255,255,.1);
          color: #f1f5f9;
        }
        .auth-field input::placeholder { color: #94a3b8; }
        .dark .auth-field input::placeholder { color: #64748b; }
        
        .auth-field input:hover { border-color: #cbd5e1; }
        .dark .auth-field input:hover { border-color: rgba(255,255,255,.2); }
        
        .auth-field input:focus {
          border-color: #818cf8;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(99,102,241,.1), 0 8px 24px -12px rgba(99,102,241,.3);
        }
        .dark .auth-field input:focus {
          background: rgba(129,140,248,.06);
          box-shadow: 0 0 0 4px rgba(99,102,241,.15), 0 8px 24px -12px rgba(99,102,241,.5);
        }
        
        .auth-field .field-icon {
          position: absolute;
          left: .95rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          transition: color .3s;
          pointer-events: none;
        }
        .dark .auth-field .field-icon { color: #64748b; }
        .auth-field:focus-within .field-icon { color: #6366f1; }
        .dark .auth-field:focus-within .field-icon { color: #818cf8; }

        .auth-submit {
          background: linear-gradient(135deg, #6366f1, #8b5cf6 55%, #d946ef);
          background-size: 200% auto;
          transition: background-position .5s, transform .25s, box-shadow .3s;
          box-shadow: 0 12px 30px -10px rgba(139,92,246,.4);
          color: white;
          font-weight: 600;
          border-radius: .85rem;
          padding: .95rem 1.5rem;
          width: 100%;
          border: none;
          cursor: pointer;
        }
        .auth-submit:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-2px);
          box-shadow: 0 18px 40px -12px rgba(217,70,239,.6);
        }
        .dark .auth-submit { box-shadow: 0 12px 30px -10px rgba(139,92,246,.6); }
        .auth-submit:disabled { opacity: .7; cursor: not-allowed; }
      `}</style>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
        
        {/* Header */}
        <Link to="/" className="animate-fade-up d1 mb-10 flex items-center gap-2.5 self-start group">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40 transition-transform duration-500 group-hover:rotate-[10deg]">
            <Sparkles className="size-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            CareerPilot <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent dark:from-indigo-400 dark:to-fuchsia-400">AI</span>
          </span>
        </Link>

        {/* Titles */}
        <p className="animate-fade-up d1 text-xs font-bold uppercase tracking-[.25em] text-indigo-600 dark:text-indigo-400">
          Welcome back
        </p>
        <h1 className="animate-fade-up d2 mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Continue your career journey.
        </h1>
        <p className="animate-fade-up d3 mt-3 text-sm text-slate-600 dark:text-slate-400">
          Pick up where you left off and keep your next step in sight.
        </p>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="animate-fade-up d3">
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                Email address
              </label>
              <div className="auth-field">
                <Mail className="field-icon size-4" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="animate-fade-up d4">
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="auth-field">
                <Lock className="field-icon size-4" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <Alert type="error">{error}</Alert>}

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="auth-submit animate-fade-up d5 group mt-2">
              <span className="inline-flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25" />
                      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Register link */}
          <p className="animate-fade-up d5 mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            New to CareerPilot?{' '}
            <Link to="/register" className="group inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
              Create an account <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}