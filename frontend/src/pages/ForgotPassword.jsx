import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Mail, ArrowLeft, ShieldCheck } from 'lucide-react'
import { authApi } from '../api/index.js'

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [devNote, setDevNote] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const email = new FormData(e.currentTarget).get('email')
    try {
      const { data } = await authApi.forgotPassword(email)
      setSent(true)
      if (data.devNote) setDevNote(data.devNote)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#06070f] text-slate-100 font-['Inter'] antialiased selection:bg-indigo-500/30">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
        <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/30 blur-[100px]" />
        <div className="absolute top-20 right-0 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/20 blur-[100px]" />
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp .7s cubic-bezier(.2,.9,.3,1) both; }
        .d1{animation-delay:.06s}.d2{animation-delay:.12s}.d3{animation-delay:.18s}.d4{animation-delay:.24s}

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

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
        <Link to="/" className="animate-fade-up d1 mb-10 flex items-center gap-2.5 self-start group">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40 transition-transform duration-500 group-hover:rotate-[10deg]">
            <Sparkles className="size-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            CareerPilot <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
          </span>
        </Link>

        <p className="animate-fade-up d1 text-xs font-bold uppercase tracking-[.25em] text-indigo-400">Account recovery</p>
        <h1 className="animate-fade-up d2 mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Reset your password.</h1>
        <p className="animate-fade-up d3 mt-3 text-sm text-slate-400">Enter your email and we'll help you get back to your roadmap.</p>

        <div className="mt-8">
          {sent ? (
            <div className="animate-fade-up d4 space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-5 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-sm text-emerald-200">
                  If an account exists for that email, recovery instructions will be sent. Check your inbox (and spam folder).
                </p>
              </div>
              {devNote && (
                <div className="mt-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-xs text-indigo-300">
                  <strong>Dev mode:</strong> {devNote}. The token was printed to the server console. Use it at <Link to="/reset-password" className="underline hover:text-white">/reset-password</Link>.
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="animate-fade-up d3">
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-400">Email address</label>
                <div className="auth-field">
                  <Mail className="field-icon size-4" />
                  <input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
                </div>
              </div>
              {error && <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div>}
              <button type="submit" disabled={loading} className="auth-submit animate-fade-up d4 mt-2">
                {loading ? 'Sending…' : 'Send recovery link'}
              </button>
            </form>
          )}
          <p className="animate-fade-up d4 mt-8 text-center text-sm text-slate-400">
            <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              <ArrowLeft className="size-3.5" /> Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}