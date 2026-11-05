import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react'
import { authApi } from '../api/index.js'
import { Alert } from '../components/ui.jsx'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await authApi.login({ email, password })
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or insufficient permissions.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center bg-[#06070f] px-5 py-10 font-['Inter'] antialiased text-slate-100 selection:bg-indigo-500/30 overflow-hidden">
      
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
        <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/30 blur-[100px]" />
        <div className="absolute top-20 right-0 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/20 blur-[100px]" />
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp .7s cubic-bezier(.2,.9,.3,1) both; }
        
        .auth-field { position: relative; transition: all .3s ease; }
        .auth-field:focus-within { transform: translateY(-1px); }
        .auth-field input { width: 100%; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: .85rem; padding: .9rem 1rem .9rem 2.85rem; color: #f1f5f9; font-size: .9rem; outline: none; transition: all .3s ease; }
        .auth-field input::placeholder { color: #64748b; }
        .auth-field input:hover { border-color: rgba(255,255,255,.2); }
        .auth-field input:focus { border-color: rgba(129,140,248,.7); background: rgba(129,140,248,.06); box-shadow: 0 0 0 4px rgba(99,102,241,.15), 0 8px 24px -12px rgba(99,102,241,.5); }
        .auth-field .field-icon { position: absolute; left: .95rem; top: 50%; transform: translateY(-50%); color: #64748b; transition: color .3s; pointer-events: none; }
        .auth-field:focus-within .field-icon { color: #818cf8; }

        .auth-submit { background: linear-gradient(135deg, #6366f1, #8b5cf6 55%, #d946ef); background-size: 200% auto; transition: background-position .5s, transform .25s, box-shadow .3s; box-shadow: 0 12px 30px -10px rgba(139,92,246,.6); color: white; font-weight: 600; border-radius: .85rem; padding: .95rem 1.5rem; width: 100%; border: none; cursor: pointer; }
        .auth-submit:hover:not(:disabled) { background-position: right center; transform: translateY(-2px); box-shadow: 0 18px 40px -12px rgba(217,70,239,.7); }
        .auth-submit:disabled { opacity: .7; cursor: not-allowed; }
      `}</style>

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Brand */}
        <Link to="/" className="group flex items-center gap-2.5 font-bold text-white">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40 transition-transform duration-500 group-hover:rotate-[10deg]">
            <Sparkles className="size-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            CareerPilot <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
          </span>
        </Link>

        <div className="mt-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-indigo-400">
            <ShieldCheck className="size-4" /> Platform control center
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Welcome back.</h1>
          <p className="mt-3 text-sm text-slate-400">Sign in with your super admin account to manage CareerPilot.</p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
            {/* Email Field */}
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-400">
                Email
              </label>
              <div className="auth-field">
                <Mail className="field-icon size-4" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@careerpilot.ai"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-400">
                Password
              </label>
              <div className="auth-field">
                <Lock className="field-icon size-4" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <Alert type="error">{error}</Alert>}

            {/* Submit Button */}
            <button type="submit" disabled={busy} className="auth-submit group mt-2">
              <span className="inline-flex items-center justify-center gap-2">
                {busy ? (
                  <>
                    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25" />
                      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in to admin
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </form>

          <Link to="/" className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to CareerPilot
          </Link>
        </div>
      </div>
    </main>
  )
}