import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ShieldCheck } from 'lucide-react'
import { authApi } from '../api/index.js'
import { Button, Field, Alert } from '../components/ui.jsx'

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
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-2.5 font-bold text-white">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white">
            <Sparkles className="size-4" />
          </span>
          CareerPilot <span className="text-indigo-400">AI</span>
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
            <ShieldCheck className="size-3.5" /> Platform control center
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Welcome back.</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in with your super admin account to manage CareerPilot.</p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-300">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-300">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20" />
            </div>
            {error && (
              <div role="alert" className="rounded-xl border border-rose-800 bg-rose-950 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}
            <button type="submit" disabled={busy}
              className="rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60">
              {busy ? 'Signing in…' : 'Sign in to admin'}
            </button>
          </form>

          <Link to="/" className="mt-8 block text-center text-sm text-slate-500 hover:text-slate-300 transition">
            ← Back to CareerPilot
          </Link>
        </div>
      </div>
    </main>
  )
}
