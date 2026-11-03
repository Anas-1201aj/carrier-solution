import { useState, useEffect } from 'react'
import {
  Briefcase, Plus, X, ExternalLink, Calendar, DollarSign,
  MapPin, Wifi, Trash2, ChevronDown, ChevronUp, GripVertical,
} from 'lucide-react'
import { jobsApi } from '../api/index.js'
import AppLayout from '../layouts/AppLayout.jsx'
import { Button, Card, Badge, Alert, PageLoader, EmptyState, Field, Textarea, Modal } from '../components/ui.jsx'

const COLUMNS = [
  { id: 'wishlist',     label: 'Wishlist',      color: 'slate'  },
  { id: 'applied',      label: 'Applied',        color: 'indigo' },
  { id: 'phone-screen', label: 'Phone Screen',   color: 'blue'   },
  { id: 'interview',    label: 'Interview',      color: 'amber'  },
  { id: 'offer',        label: 'Offer',          color: 'green'  },
  { id: 'rejected',     label: 'Rejected',       color: 'red'    },
]

const STATUS_COLORS = {
  wishlist: 'bg-slate-100 text-slate-700 border-slate-200',
  applied: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'phone-screen': 'bg-blue-50 text-blue-700 border-blue-200',
  interview: 'bg-amber-50 text-amber-700 border-amber-200',
  offer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  accepted: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  withdrawn: 'bg-slate-100 text-slate-500 border-slate-200',
}

const BADGE_COLORS = { wishlist: 'slate', applied: 'indigo', 'phone-screen': 'blue', interview: 'amber', offer: 'green', rejected: 'red', accepted: 'green', withdrawn: 'slate' }

function AddJobModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ company: '', role: '', status: 'wishlist', location: '', remote: false, jobUrl: '', notes: '', salaryMin: '', salaryMax: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function submit(e) {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) { setError('Company and role are required.'); return }
    setSaving(true)
    setError('')
    try {
      const payload = { ...form }
      if (payload.salaryMin) payload.salaryMin = Number(payload.salaryMin)
      if (payload.salaryMax) payload.salaryMax = Number(payload.salaryMax)
      const { data } = await jobsApi.add(payload)
      onAdd(data.application)
      setForm({ company: '', role: '', status: 'wishlist', location: '', remote: false, jobUrl: '', notes: '', salaryMin: '', salaryMax: '' })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add application.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Job Application">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Company *" id="company" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="e.g. Stripe" required />
          <Field label="Role *" id="role" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="e.g. Frontend Engineer" required />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
              {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <Field label="Location" id="location" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. San Francisco, CA" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Min salary" id="salaryMin" type="number" value={form.salaryMin} onChange={(e) => set('salaryMin', e.target.value)} placeholder="e.g. 80000" />
          <Field label="Max salary" id="salaryMax" type="number" value={form.salaryMax} onChange={(e) => set('salaryMax', e.target.value)} placeholder="e.g. 120000" />
        </div>
        <Field label="Job URL" id="jobUrl" type="url" value={form.jobUrl} onChange={(e) => set('jobUrl', e.target.value)} placeholder="https://..." />
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input type="checkbox" checked={form.remote} onChange={(e) => set('remote', e.target.checked)} className="accent-indigo-600 size-4" />
          Remote position
        </label>
        <Textarea label="Notes" id="notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Any notes about this role…" rows={3} />
        {error && <Alert type="error">{error}</Alert>}
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Add application</Button>
        </div>
      </form>
    </Modal>
  )
}

function JobCard({ job, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function changeStatus(status) {
    setSaving(true)
    try { await onUpdate(job._id, { status }) } finally { setSaving(false) }
  }

  async function del() {
    if (!confirm(`Remove "${job.role}" at ${job.company}?`)) return
    setDeleting(true)
    try { await onDelete(job._id) } finally { setDeleting(false) }
  }

  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md ${STATUS_COLORS[job.status] || 'border-slate-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm leading-snug truncate">{job.role}</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{job.company}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {job.location && (
              <span className="flex items-center gap-0.5 text-xs text-slate-400">
                <MapPin className="size-3" />{job.location}
              </span>
            )}
            {job.remote && (
              <span className="flex items-center gap-0.5 text-xs text-slate-400">
                <Wifi className="size-3" />Remote
              </span>
            )}
            {(job.salaryMin || job.salaryMax) && (
              <span className="flex items-center gap-0.5 text-xs text-slate-400">
                <DollarSign className="size-3" />
                {job.salaryMin ? `$${(job.salaryMin / 1000).toFixed(0)}k` : ''}
                {job.salaryMin && job.salaryMax ? '–' : ''}
                {job.salaryMax ? `$${(job.salaryMax / 1000).toFixed(0)}k` : ''}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {job.jobUrl && (
            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer"
              className="grid size-7 place-items-center rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition">
              <ExternalLink className="size-3.5" />
            </a>
          )}
          <button onClick={() => setExpanded(!expanded)}
            className="grid size-7 place-items-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition">
            {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
          {job.notes && <p className="text-xs text-slate-600 leading-relaxed">{job.notes}</p>}
          {job.appliedAt && (
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="size-3" /> Applied {new Date(job.appliedAt).toLocaleDateString()}
            </p>
          )}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Move to:</p>
            <div className="flex flex-wrap gap-1">
              {COLUMNS.filter((c) => c.id !== job.status).map((c) => (
                <button key={c.id} disabled={saving} onClick={() => changeStatus(c.id)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition disabled:opacity-50">
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={del} disabled={deleting}
            className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 transition disabled:opacity-50">
            <Trash2 className="size-3" /> {deleting ? 'Removing…' : 'Remove'}
          </button>
        </div>
      )}
    </div>
  )
}

function KanbanColumn({ col, jobs, onUpdate, onDelete, onAdd }) {
  return (
    <div className="flex w-64 flex-shrink-0 flex-col gap-3 lg:w-auto lg:flex-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-2 w-2 rounded-full ${
            col.color === 'slate' ? 'bg-slate-400' :
            col.color === 'indigo' ? 'bg-indigo-400' :
            col.color === 'blue' ? 'bg-blue-400' :
            col.color === 'amber' ? 'bg-amber-400' :
            col.color === 'green' ? 'bg-emerald-400' : 'bg-rose-400'
          }`} />
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">{col.label}</h3>
          <span className="text-xs text-slate-400">({jobs.length})</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 min-h-[100px]">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
        {jobs.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-400">No applications</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Jobs() {
  const [kanban, setKanban] = useState({})
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [error, setError] = useState('')
  const [view, setView] = useState('kanban') // kanban | list

  useEffect(() => {
    jobsApi.list().then(({ data }) => {
      setApplications(data.applications || [])
      setKanban(data.kanban || {})
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function rebuild(apps) {
    const k = {}
    for (const col of COLUMNS) k[col.id] = apps.filter((a) => a.status === col.id)
    setKanban(k)
    setApplications(apps)
  }

  function handleAdd(app) {
    const updated = [app, ...applications]
    rebuild(updated)
  }

  async function handleUpdate(id, update) {
    try {
      const { data } = await jobsApi.update(id, update)
      const updated = applications.map((a) => a._id === id ? data.application : a)
      rebuild(updated)
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.')
    }
  }

  async function handleDelete(id) {
    try {
      await jobsApi.remove(id)
      const updated = applications.filter((a) => a._id !== id)
      rebuild(updated)
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.')
    }
  }

  if (loading) return <AppLayout><PageLoader /></AppLayout>

  const total = applications.length
  const activeCount = applications.filter((a) => ['applied', 'phone-screen', 'interview', 'offer'].includes(a.status)).length
  const offerCount = applications.filter((a) => a.status === 'offer').length

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Application Tracker</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Job Tracker</h1>
            <p className="mt-2 text-sm text-slate-500">Track your job applications through every stage of the process.</p>
          </div>
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="size-4" /> Add application
          </Button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total applications', value: total },
            { label: 'Active pipeline', value: activeCount },
            { label: 'Offers received', value: offerCount },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {/* View toggle */}
        <div className="flex items-center gap-2">
          <button onClick={() => setView('kanban')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${view === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Kanban
          </button>
          <button onClick={() => setView('list')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${view === 'list' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            List
          </button>
        </div>

        {total === 0 ? (
          <Card>
            <EmptyState
              icon={Briefcase}
              title="No applications yet"
              description="Start tracking your job applications. Add your first one to get started."
              action={<Button onClick={() => setShowAdd(true)}><Plus className="size-4" /> Add application</Button>}
            />
          </Card>
        ) : view === 'kanban' ? (
          /* Kanban board — horizontal scroll on mobile */
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-[900px] lg:min-w-0 lg:grid" style={{ gridTemplateColumns: `repeat(${COLUMNS.length}, 1fr)` }}>
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.id}
                  col={col}
                  jobs={kanban[col.id] || []}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ) : (
          /* List view */
          <div className="space-y-2">
            {applications.map((job) => (
              <div key={job._id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{job.role}</p>
                    <Badge color={BADGE_COLORS[job.status] || 'slate'}>{job.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-500">{job.company}{job.location ? ` · ${job.location}` : ''}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {job.jobUrl && (
                    <a href={job.jobUrl} target="_blank" rel="noopener noreferrer"
                      className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-500 transition">
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                  <div className="flex flex-col gap-1">
                    <select value={job.status} onChange={(e) => handleUpdate(job._id, { status: e.target.value })}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none bg-white focus:border-indigo-400">
                      {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <button onClick={() => handleDelete(job._id)}
                    className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddJobModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
    </AppLayout>
  )
}
