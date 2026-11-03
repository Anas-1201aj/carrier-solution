import { useState, useEffect } from 'react'
import { User, Save, GraduationCap, Briefcase, Target, BookOpen, Clock, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { profileApi } from '../api/index.js'
import AppLayout from '../layouts/AppLayout.jsx'
import { Button, Card, Badge, Alert, PageLoader, ProgressBar } from '../components/ui.jsx'

const SKILL_OPTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust',
  'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Express',
  'SQL', 'MongoDB', 'PostgreSQL', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
  'Git', 'GraphQL', 'REST APIs', 'Machine Learning', 'CSS/HTML',
]

const INTEREST_OPTIONS = [
  'Web Development', 'Mobile Apps', 'Data Science', 'AI/ML', 'DevOps',
  'Cybersecurity', 'UX/Design', 'Product Management', 'Cloud Computing',
  'Blockchain', 'Game Development', 'Embedded Systems',
]

const ROLE_OPTIONS = [
  'Frontend Developer', 'Backend Developer', 'Full-Stack Developer',
  'Data Scientist', 'ML Engineer', 'DevOps Engineer', 'Cloud Architect',
  'Product Manager', 'UX Designer', 'Mobile Developer', 'Security Engineer',
  'QA Engineer', 'Solutions Architect', 'Technical Lead',
]

function TagPicker({ label, options, selected = [], onChange, color = 'indigo' }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter((v) => v !== opt))
    else onChange([...selected, opt])
  }
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const sel = selected.includes(opt)
          return (
            <button key={opt} type="button" onClick={() => toggle(opt)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                sel
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
              }`}>
              {opt}
            </button>
          )
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-slate-400">{selected.length} selected</p>
      )}
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <div className="grid size-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="size-4" />
        </div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </Card>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [educationLevel, setEducationLevel] = useState('')
  const [degree, setDegree] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [college, setCollege] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('no-experience')
  const [weeklyLearningTime, setWeeklyLearningTime] = useState(10)
  const [technicalSkills, setTechnicalSkills] = useState([])
  const [interests, setInterests] = useState([])
  const [targetRoles, setTargetRoles] = useState([])
  const [careerGoals, setCareerGoals] = useState('')

  useEffect(() => {
    profileApi.get().then(({ data }) => {
      const p = data.profile
      setProfile(p)
      if (p) {
        setEducationLevel(p.educationLevel || '')
        setDegree(p.degree || '')
        setGraduationYear(p.graduationYear || '')
        setCollege(p.college || p.university || '')
        setExperienceLevel(p.experienceLevel || 'no-experience')
        setWeeklyLearningTime(p.weeklyLearningTime || 10)
        setTechnicalSkills(p.technicalSkills || [])
        setInterests(p.interests || [])
        setTargetRoles(p.targetRoles || [])
        setCareerGoals(p.careerGoals || '')
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { data } = await profileApi.update({
        educationLevel,
        degree,
        graduationYear,
        college,
        experienceLevel,
        weeklyLearningTime: Number(weeklyLearningTime),
        technicalSkills,
        interests,
        targetRoles,
        careerGoals,
      })
      setProfile(data.profile)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <AppLayout><PageLoader /></AppLayout>

  const readiness = profile?.readinessScore ?? 0
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <AppLayout>
      <form onSubmit={save} className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">My Profile</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Profile & Settings</h1>
          </div>
          <Button type="submit" loading={saving}>
            {saved ? <><CheckCircle className="size-4" /> Saved!</> : <><Save className="size-4" /> Save changes</>}
          </Button>
        </div>

        {error && <Alert type="error">{error}</Alert>}
        {saved && <Alert type="success">Profile saved successfully!</Alert>}

        {/* Identity card */}
        <Card>
          <div className="flex items-center gap-5">
            <div className="grid size-16 place-items-center rounded-2xl bg-indigo-600 text-xl font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              {profile?.onboardingComplete && (
                <Badge color="green" className="mt-1">Profile complete</Badge>
              )}
            </div>
          </div>
          {readiness > 0 && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Career Readiness</p>
              <ProgressBar value={readiness} label={`${readiness}/100`} color="indigo" />
            </div>
          )}
        </Card>

        {/* Education */}
        <Section icon={GraduationCap} title="Education">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Education level</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {['High School', 'Undergraduate', 'Graduate', 'Bootcamp', 'Self-taught'].map((opt) => (
                  <button key={opt} type="button" onClick={() => setEducationLevel(opt)}
                    className={`rounded-xl border px-3.5 py-2 text-sm transition ${educationLevel === opt ? 'border-indigo-400 bg-indigo-50 text-indigo-700 font-semibold' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Degree / Field</label>
                <input value={degree} onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Graduation year</label>
                <input value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)}
                  placeholder="e.g. 2026"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">College / University</label>
              <input value={college} onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. MIT, Stanford, IIT…"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
            </div>
          </div>
        </Section>

        {/* Experience */}
        <Section icon={Briefcase} title="Experience">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Experience level</label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {[
                  { value: 'no-experience', label: 'No experience yet' },
                  { value: 'some-projects', label: 'Personal / academic projects only' },
                  { value: 'internship', label: 'Internship or part-time work' },
                  { value: 'professional', label: 'Professional full-time experience' },
                ].map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setExperienceLevel(opt.value)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition ${experienceLevel === opt.value ? 'border-indigo-400 bg-indigo-50 text-indigo-700 font-semibold' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Weekly learning time: <span className="text-indigo-600">{weeklyLearningTime} hrs/week</span>
              </label>
              <input type="range" min={1} max={40} step={1} value={weeklyLearningTime}
                onChange={(e) => setWeeklyLearningTime(Number(e.target.value))}
                className="accent-indigo-600" />
              <div className="flex justify-between text-xs text-slate-400">
                <span>1 hr</span><span>40 hrs</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Skills */}
        <Section icon={BookOpen} title="Skills & Interests">
          <div className="space-y-6">
            <TagPicker
              label="Technical skills"
              options={SKILL_OPTIONS}
              selected={technicalSkills}
              onChange={setTechnicalSkills}
            />
            <TagPicker
              label="Areas of interest"
              options={INTEREST_OPTIONS}
              selected={interests}
              onChange={setInterests}
            />
          </div>
        </Section>

        {/* Career goals */}
        <Section icon={Target} title="Career Goals">
          <div className="space-y-4">
            <TagPicker
              label="Target roles"
              options={ROLE_OPTIONS}
              selected={targetRoles}
              onChange={setTargetRoles}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Career goal statement</label>
              <textarea
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                rows={4}
                placeholder="Describe where you want to be in 2–3 years…"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none resize-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>
        </Section>

        {/* Save button (bottom) */}
        <div className="flex justify-end pb-4">
          <Button type="submit" size="lg" loading={saving}>
            {saved ? <><CheckCircle className="size-4" /> Saved!</> : <><Save className="size-4" /> Save changes</>}
          </Button>
        </div>
      </form>
    </AppLayout>
  )
}
