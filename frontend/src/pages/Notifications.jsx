import { useState, useEffect } from 'react'
import { Bell, CheckCheck, Trash2, ExternalLink, Info, Trophy, Briefcase, AlertCircle } from 'lucide-react'
import { notificationsApi } from '../api/index.js'
import AppLayout from '../layouts/AppLayout.jsx'
import { Button, Card, Badge, Alert, PageLoader, EmptyState } from '../components/ui.jsx'

const TYPE_ICONS = {
  achievement: Trophy,
  job: Briefcase,
  reminder: Bell,
  alert: AlertCircle,
  info: Info,
}

const TYPE_COLORS = {
  achievement: 'bg-amber-50 text-amber-600 border-amber-200',
  job: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  reminder: 'bg-blue-50 text-blue-600 border-blue-200',
  alert: 'bg-rose-50 text-rose-600 border-rose-200',
  info: 'bg-slate-50 text-slate-500 border-slate-200',
}

function NotificationItem({ notification, onMarkRead, onDelete }) {
  const Icon = TYPE_ICONS[notification.type] || Bell
  const colorClass = TYPE_COLORS[notification.type] || TYPE_COLORS.info
  const isUnread = !notification.read

  return (
    <div className={`flex items-start gap-4 rounded-2xl border p-5 transition ${isUnread ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200 bg-white'}`}>
      <div className={`grid size-9 flex-shrink-0 place-items-center rounded-xl border ${colorClass}`}>
        <Icon className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`text-sm font-semibold ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
              {notification.title}
              {isUnread && <span className="ml-2 inline-block size-2 rounded-full bg-indigo-500 align-middle" />}
            </p>
            {notification.message && (
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">{notification.message}</p>
            )}
            <p className="mt-2 text-xs text-slate-400">
              {new Date(notification.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {notification.actionUrl && (
              <a href={notification.actionUrl}
                className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-200 transition">
                <ExternalLink className="size-3.5" />
              </a>
            )}
            {isUnread && (
              <button onClick={() => onMarkRead(notification._id)}
                className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-200 transition"
                title="Mark as read">
                <CheckCheck className="size-3.5" />
              </button>
            )}
            <button onClick={() => onDelete(notification._id)}
              className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition"
              title="Delete">
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
        {notification.actionUrl && notification.actionLabel && (
          <a href={notification.actionUrl}
            className="mt-3 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition">
            {notification.actionLabel}
            <ExternalLink className="size-3" />
          </a>
        )}
      </div>
    </div>
  )
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // all | unread

  useEffect(() => {
    notificationsApi.list().then(({ data }) => {
      setNotifications(data.notifications || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function markRead(id) {
    try {
      await notificationsApi.markRead(id)
      setNotifications((nn) => nn.map((n) => n._id === id ? { ...n, read: true } : n))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark as read.')
    }
  }

  async function markAllRead() {
    setMarkingAll(true)
    try {
      await notificationsApi.markAllRead()
      setNotifications((nn) => nn.map((n) => ({ ...n, read: true })))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark all as read.')
    } finally {
      setMarkingAll(false)
    }
  }

  async function deleteNotification(id) {
    try {
      await notificationsApi.remove(id)
      setNotifications((nn) => nn.filter((n) => n._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notification.')
    }
  }

  if (loading) return <AppLayout><PageLoader /></AppLayout>

  const unreadCount = notifications.filter((n) => !n.read).length
  const displayed = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Inbox</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Notifications</h1>
            <p className="mt-2 text-sm text-slate-500">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'You\'re all caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllRead} loading={markingAll}>
              <CheckCheck className="size-3.5" /> Mark all read
            </Button>
          )}
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {/* Filter tabs */}
        <div className="flex gap-2">
          {[{ id: 'all', label: `All (${notifications.length})` }, { id: 'unread', label: `Unread (${unreadCount})` }].map((tab) => (
            <button key={tab.id} onClick={() => setFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filter === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        {displayed.length === 0 ? (
          <Card>
            <EmptyState
              icon={Bell}
              title={filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              description={filter === 'unread' ? 'All caught up! Switch to "All" to see past notifications.' : 'Notifications about your career progress and activities will appear here.'}
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {displayed.map((n) => (
              <NotificationItem
                key={n._id}
                notification={n}
                onMarkRead={markRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
