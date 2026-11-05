import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, ShieldCheck, Mail, User, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import { Alert } from '../components/ui.jsx' // We keep Alert for errors

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    try {
      await register({ name: fd.get('name'), email: fd.get('email'), password: fd.get('password') })
      navigate('/onboarding')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // 1. FORCE DARK THEME: Wrapping everything in a dark container that overrides AuthLayout
    <div className="relative min-h-screen bg-[#06070f] text-slate-100 font-['Inter'] antialiased selection:bg-indigo-500/30">
      
      {/* Background Effects matching Home */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
        <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/30 blur-[100px]" />
        <div className="absolute top-20 right-0 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/20 blur-[100px]" />
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        .auth-reveal { animation: fadeUp .7s cubic-bezier(.2,.9,.3,1) both; }
        .d1{animation-delay:.06s}.d2{animation-delay:.12s}.d3{animation-delay:.18s}
        .d4{animation-delay:.24s}.d5{animation-delay:.3s}.d6{animation-delay:.36s}

        .auth-field { position: relative; transition: all .3s ease; }
        .auth-field:focus-within { transform: translateY(-1px); }
        
        .auth-field input {
          width: 100%;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: .85rem;
          padding: .9rem 1rem .9rem 2.85rem;
          color: #f1f5f9;
          font-size: .9rem;
          outline: none;
          transition: all .3s ease;
        }
        .auth-field input::placeholder { color: #64748b; }
        .auth-field input:hover { border-color: rgba(255,255,255,.2); }
        .auth-field input:focus {
          border-color: rgba(129,140,248,.7);
          background: rgba(129,140,248,.06);
          box-shadow: 0 0 0 4px rgba(99,102,241,.15), 0 8px 24px -12px rgba(99,102,241,.5);
        }
        
        .auth-field .field-icon {
          position: absolute;
          left: .95rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          transition: color .3s;
          pointer-events: none;
        }
        .auth-field:focus-within .field-icon { color: #818cf8; }

        .auth-checkbox {
          appearance: none;
          width: 1.05rem;
          height: 1.05rem;
          border-radius: .35rem;
          border: 1.5px solid rgba(255,255,255,.2);
          background: rgba(255,255,255,.03);
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
          margin-top: .1rem;
          transition: all .2s;
        }
        .auth-checkbox:checked {
          background: linear-gradient(135deg,#6366f1,#d946ef);
          border-color: transparent;
        }
        .auth-checkbox:checked::after {
          content:'✓';
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          color: white;
          font-size: .7rem;
          font-weight: 800;
        }

        .auth-submit {
          background: linear-gradient(135deg, #6366f1, #8b5cf6 55%, #d946ef);
          background-size: 200% auto;
          transition: background-position .5s, transform .25s, box-shadow .3s;
          box-shadow: 0 12px 30px -10px rgba(139,92,246,.6);
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
          box-shadow: 0 18px 40px -12px rgba(217,70,239,.7);
        }
        .auth-submit:disabled { opacity: .7; cursor: not-allowed; }

        .social-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          padding: .75rem;
          border-radius: .75rem;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.03);
          color: #cbd5e1;
          font-size: .8rem;
          font-weight: 500;
          transition: all .25s;
          cursor: pointer;
          width: 100%;
        }
        .social-btn:hover {
          background: rgba(255,255,255,.07);
          border-color: rgba(129,140,248,.4);
          color: white;
        }
      `}</style>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
        
        {/* Header matching Home */}
        <Link to="/" className="auth-reveal d1 mb-10 flex items-center gap-2.5 self-start group">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40 transition-transform duration-500 group-hover:rotate-[10deg]">
            <Sparkles className="size-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            CareerPilot <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
          </span>
        </Link>

        {/* Titles */}
        <p className="auth-reveal d1 text-xs font-bold uppercase tracking-[.25em] text-indigo-400">
          Start with clarity
        </p>
        <h1 className="auth-reveal d2 mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Build your personal roadmap.
        </h1>
        <p className="auth-reveal d3 mt-3 text-sm text-slate-400">
          Create a free account and turn your goals into a plan you can actually follow.
        </p>

        {/* Form Section */}
        <div className="mt-8">
          <div className="auth-reveal d3 mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-400/20 bg-emerald-400/[.06] px-4 py-2.5">
            <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">Free forever</span> — no credit card required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="auth-reveal d3">
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-400">
                Full name
              </label>
              <div className="auth-field">
                <User className="field-icon size-4" />
                <input id="name" name="name" placeholder="Alex Morgan" required minLength={2} autoComplete="name" />
              </div>
            </div>

            {/* Email */}
            <div className="auth-reveal d4">
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-400">
                Email address
              </label>
              <div className="auth-field">
                <Mail className="field-icon size-4" />
                <input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
              </div>
            </div>

            {/* Password */}
            <div className="auth-reveal d5">
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-400">
                Password
              </label>
              <div className="auth-field">
                <Lock className="field-icon size-4" />
                <input id="password" name="password" type="password" placeholder="At least 8 characters" required minLength={8} autoComplete="new-password" />
              </div>
            </div>

            {/* Checkbox */}
            <label className="auth-reveal d5 flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-400">
              <input type="checkbox" required className="auth-checkbox" />
              <span>
                I agree to the <span className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">terms</span> and understand that CareerPilot uses my answers to personalise recommendations.
              </span>
            </label>

            {error && <Alert type="error">{error}</Alert>}

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="auth-submit auth-reveal d6 group mt-2">
              <span className="inline-flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25" />
                      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Social Login */}
          <div className="auth-reveal d7 mt-6">
            <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[.15em] text-slate-500 before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">
              {/* or continue with */}
            </div>
            <div className="mt-4 flex gap-3">
              {/* <button type="button" className="social-btn">
                <svg className="size-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.7 0 3.23.6 4.43 1.77l3.3-3.3C17.77 1.56 15.1.5 12 .5 7.3.5 3.26 3.2 1.28 7.1l3.85 3C6.06 7.1 8.8 5.04 12 5.04z"/><path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.5h6.45c-.28 1.5-1.12 2.77-2.4 3.63l3.7 2.87c2.17-2 3.75-4.95 3.75-8.65z"/><path fill="#34A853" d="M5.13 14.9A7.1 7.1 0 0 1 4.75 12c0-1 .17-1.98.38-2.9L1.28 6.1A11.95 11.95 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.85-2.5z"/><path fill="#FBBC05" d="M12 23.5c3.24 0 5.96-1.07 7.94-2.9l-3.7-2.87c-1.02.69-2.33 1.1-4.24 1.1-3.2 0-5.94-2.06-6.87-4.93l-3.85 3C3.26 20.8 7.3 23.5 12 23.5z"/></svg>
                Google
              </button> */}
              {/* <button type="button" className="social-btn">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.61-.02 2.9-.02 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </button> */}
            </div>
          </div>

          <p className="auth-reveal d7 mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="group inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}