import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles, LayoutDashboard, Users, BarChart3, Settings,
  LogOut, Menu, X, Bell, ShieldCheck, Search, ArrowRight, Check,
} from 'lucide-react'
import { adminApi, authApi } from '../api/index.js'

function StatCard({ label, value, icon: Icon, note }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-sm">{label}</span>
        <Icon className="size-4" />
      </div>
      <p className="mt-4 text-2xl font-bold text-white">{value ?? '—'}</p>
      {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
    </div>
  )
}

function Overview({ data, onRefresh }) {
  const metrics = [
    { label: 'Total students', value: data?.metrics?.total, icon: Users, note: 'All registered accounts' },
    { label: 'New this week', value: data?.metrics?.new7, icon: Sparkles, note: 'Last 7 days' },
    { label: 'Active this month', value: data?.metrics?.active, icon: BarChart3, note: 'Logged in last 30 days' },
    { label: 'Onboarding complete', value: data?.metrics?.completedOnboarding, icon: Check, note: 'Profiles fully set up' },
  ]

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">{today}</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Good morning, admin.</h1>
          <p className="mt-1 text-slate-400">Here's what's happening across CareerPilot today.</p>
        </div>
        <button onClick={onRefresh}
          className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-700">
          Refresh data
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => <StatCard key={m.label} {...m} />)}
      </div>
      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-white">Recent registrations</h3>
            <p className="text-xs text-slate-400 mt-0.5">Newest students joining the platform</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="pb-3 pr-4">Student</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentStudents || []).map((s) => (
                <tr key={s.id} className="border-b border-slate-800 last:border-0">
                  <td className="py-3 pr-4 font-medium text-white">{s.name}</td>
                  <td className="py-3 pr-4 text-slate-400">{s.email}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.status === 'active' ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.recentStudents?.length && (
            <p className="py-8 text-center text-sm text-slate-500">No registrations yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Students({ students, query, setQuery, onRefresh }) {
  const toggleStatus = async (student) => {
    try {
      await adminApi.setStatus(student.id, student.status === 'active' ? 'deactivated' : 'active')
      onRefresh()
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Directory</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Students</h1>
        <p className="mt-1 text-slate-400">Manage student access and review account activity.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5">
          <Search className="size-4 text-slate-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email…"
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
        </div>
        <span className="text-sm text-slate-500">{students?.total ?? 0} students</span>
      </div>
      <div className="rounded-2xl border border-slate-700 bg-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 pr-4">Student</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Joined</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {(students?.students || []).map((s) => (
                <tr key={s.id} className="border-b border-slate-800 last:border-0">
                  <td className="px-5 py-3.5 pr-4 font-medium text-white">{s.name}</td>
                  <td className="py-3.5 pr-4 text-slate-400">{s.email}</td>
                  <td className="py-3.5 pr-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.status === 'active' ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="py-3.5 px-5">
                    <button onClick={() => toggleStatus(s)}
                      className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-700">
                      {s.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!students?.students?.length && (
            <p className="py-8 text-center text-sm text-slate-500">No students match your search.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Analytics({ data }) {
  const trend = data?.registrationTrend || []
  const maxCount = Math.max(...trend.map((p) => p.count), 1)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Insights</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-slate-400">Registration activity and onboarding health over the last 30 days.</p>
      </div>
      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-white">Registration trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">Daily new student accounts (last 14 days)</p>
          </div>
          <BarChart3 className="size-5 text-indigo-400" />
        </div>
        {trend.length > 0 ? (
          <div className="flex items-end gap-1.5 h-40">
            {trend.slice(-14).map((point) => (
              <div key={point._id} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="w-full rounded-t-md bg-indigo-600 transition-all hover:bg-indigo-500"
                  style={{ height: `${Math.max(4, (point.count / maxCount) * 100)}%` }}
                  title={`${point.count} registrations on ${point._id}`} />
                <span className="text-[9px] text-slate-500 rotate-45 origin-left">{point._id.slice(5)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">Analytics will appear after registrations are recorded.</p>
        )}
      </div>
    </div>
  )
}

function AdminSettings() {
  const [name, setName] = useState('CareerPilot AI')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    adminApi.getSettings().then(({ data }) => setName(data.settings?.platformName || 'CareerPilot AI')).catch(() => {})
  }, [])

  const save = async () => {
    try {
      await adminApi.saveSettings({ platformName: name })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Configuration</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-slate-400">Control platform identity and administrative preferences.</p>
      </div>
      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 space-y-5">
        <div>
          <h3 className="font-semibold text-white">Platform identity</h3>
          <p className="text-xs text-slate-400 mt-1">These settings are stored server-side and recorded in the audit log.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-300">Platform name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20" />
        </div>
        <button onClick={save}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

const NAV = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Students', icon: Users },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
]

export default function AdminApp() {
  const navigate = useNavigate()
  const [section, setSection] = useState('Overview')
  const [data, setData] = useState(null)
  const [students, setStudents] = useState(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [mobileNav, setMobileNav] = useState(false)

  const load = async () => {
    try {
      const [dash, list] = await Promise.all([
        adminApi.dashboard(),
        adminApi.students({ search: query }),
      ])
      setData(dash.data)
      setStudents(list.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Access denied. Please sign in as admin.')
    }
  }

  useEffect(() => { load() }, [query])

  const logout = async () => {
    await authApi.logout()
    navigate('/admin/login')
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-5">
        <div className="text-center max-w-sm">
          <ShieldCheck className="size-12 mx-auto text-slate-600 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Admin access required</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button onClick={() => navigate('/admin/login')}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition">
            Return to sign in
          </button>
        </div>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Overlay */}
      {mobileNav && (
        <div className="fixed inset-0 z-30 bg-slate-950/80 lg:hidden" onClick={() => setMobileNav(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-slate-800 bg-slate-900 transition-transform lg:static lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold">
            <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white">
              <Sparkles className="size-3.5" />
            </span>
            <span className="text-sm">CareerPilot</span>
            <span className="rounded-full bg-indigo-900 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400 tracking-wide">ADMIN</span>
          </div>
          <button className="lg:hidden text-slate-500 hover:text-white" onClick={() => setMobileNav(false)}>
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1 px-3 py-4">
          {NAV.map((item) => (
            <button key={item.label} onClick={() => { setSection(item.label); setMobileNav(false) }}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition text-left ${section === item.label ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <item.icon className="size-4 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <button onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-400 transition hover:bg-slate-800">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-5 lg:px-8">
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileNav(true)}>
            <Menu className="size-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs text-slate-500">Platform control center</p>
            <p className="font-semibold text-white">{section}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-800">
              <Bell className="size-5" />
            </button>
            <div className="grid size-9 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">SA</div>
          </div>
        </header>

        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">
          {section === 'Overview' && <Overview data={data} onRefresh={load} />}
          {section === 'Students' && <Students students={students} query={query} setQuery={setQuery} onRefresh={load} />}
          {section === 'Analytics' && <Analytics data={data} />}
          {section === 'Settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  )
}
