import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { profileApi } from '../api/index.js'
import { Alert } from '../components/ui.jsx'

const EDUCATION_LEVELS = ['High School', 'Undergraduate', 'Graduate', 'Bootcamp', 'Self-taught', 'Other']
const DEGREES = ['Computer Science', 'Information Systems', 'Software Engineering', 'Data Science', 'Design / UX', 'Business', 'Mathematics', 'Other']
const GRAD_YEARS = ['2024', '2025', '2026', '2027', '2028', '2029', '2030', 'Already graduated']
const EXPERIENCE_LEVELS = [
  { value: 'no-experience', label: 'No experience yet' },
  { value: 'some-projects', label: 'Some personal projects' },
  { value: 'internship', label: 'Internship or part-time' },
  { value: 'professional', label: 'Professional experience' },
]
const SKILLS = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Java', 'TypeScript', 'CSS/HTML', 'Git', 'Docker', 'AWS', 'Data Analysis']
const INTERESTS = ['Web Development', 'Mobile Apps', 'Data Science', 'AI/ML', 'DevOps', 'Cybersecurity', 'UX/Design', 'Product Management', 'Game Development', 'Blockchain']
const TARGET_ROLES = ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Data Scientist', 'Data Analyst', 'DevOps Engineer', 'UX/UI Designer', 'Product Manager', 'ML Engineer', 'QA Engineer']
const WEEKLY_TIMES = [
  { value: 5, label: '< 5 hours/week' },
  { value: 10, label: '5–10 hours/week' },
  { value: 20, label: '10–20 hours/week' },
  { value: 40, label: '20+ hours/week' },
]

function MultiSelect({ options, value = [], onChange, limit }) {
  const toggle = (opt) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt))
    } else if (!limit || value.length < limit) {
      onChange([...value, opt])
    }
  }
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const label = typeof opt === 'object' ? opt.label : opt
        const val = typeof opt === 'object' ? opt.value : opt
        const selected = value.includes(val)
        return (
          <button
            key={val}
            type="button"
            onClick={() => toggle(val)}
            className={`group flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm transition-all duration-300 ${
              selected
                ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 font-medium shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]'
                : 'border-white/10 bg-white/[.03] text-slate-400 hover:border-white/20 hover:bg-white/[.06] hover:text-slate-200'
            }`}
          >
            {selected && <Check className="size-3.5 text-indigo-400" />}
            {label}
          </button>
        )
      })}
    </div>
  )
}

function SingleSelect({ options, value, onChange }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {options.map((opt) => {
        const label = typeof opt === 'object' ? opt.label : opt
        const val = typeof opt === 'object' ? opt.value : opt
        const selected = value === val
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`group flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 ${
              selected
                ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 font-medium shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]'
                : 'border-white/10 bg-white/[.03] text-slate-400 hover:border-white/20 hover:bg-white/[.06] hover:text-slate-200'
            }`}
          >
            <div className={`grid size-4 place-items-center rounded-full border ${selected ? 'border-indigo-400 bg-indigo-400' : 'border-slate-600'}`}>
              {selected && <div className="size-1.5 rounded-full bg-[#06070f]" />}
            </div>
            {label}
          </button>
        )
      })}
    </div>
  )
}

const STEPS = [
  { title: 'Your foundation', eyebrow: "Let's personalize your plan" },
  { title: 'Your strengths', eyebrow: 'Tell us about your skills' },
  { title: 'Your direction', eyebrow: 'Where do you want to go?' },
  { title: 'Your schedule', eyebrow: 'Set realistic expectations' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [form, setForm] = useState({
    educationLevel: '',
    degree: '',
    graduationYear: '',
    experienceLevel: '',
    technicalSkills: [],
    interests: [],
    targetRoles: [],
    careerGoals: '',
    skillsToLearn: [],
    weeklyLearningTime: 10,
  })

  // Load existing profile on mount
  useEffect(() => {
    profileApi.get().then(({ data }) => {
      if (data.profile) {
        const p = data.profile
        setForm((f) => ({
          ...f,
          educationLevel: p.educationLevel || '',
          degree: p.degree || '',
          graduationYear: p.graduationYear || '',
          experienceLevel: p.experienceLevel || '',
          technicalSkills: p.technicalSkills || [],
          interests: p.interests || [],
          targetRoles: p.targetRoles || [],
          careerGoals: p.careerGoals || '',
          skillsToLearn: p.skillsToLearn || [],
          weeklyLearningTime: p.weeklyLearningTime || 10,
        }))
        // Resume to last saved step
        if (typeof p.onboardingStep === 'number' && p.onboardingStep > 0 && !p.onboardingComplete) {
          setStep(Math.min(p.onboardingStep, STEPS.length - 1))
        }
      }
    }).catch(() => {})
  }, [])

  const set = (field) => (val) => setForm((f) => ({ ...f, [field]: val }))

  async function saveStep(nextStep) {
    setSaving(true)
    setError('')
    try {
      await profileApi.update({ ...form, onboardingStep: nextStep })
      setStep(nextStep)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save progress.')
    } finally {
      setSaving(false)
    }
  }

  async function finish() {
    setSaving(true)
    setError('')
    try {
      await profileApi.update({ ...form, onboardingComplete: true, onboardingStep: STEPS.length })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile.')
      setSaving(false)
    }
  }

  const canAdvance = [
    form.educationLevel && form.degree && form.graduationYear,
    form.technicalSkills.length > 0 && form.experienceLevel,
    form.targetRoles.length > 0,
    form.weeklyLearningTime,
  ][step]

  return (
    <div className="relative min-h-screen bg-[#06070f] text-slate-100 font-['Inter'] antialiased selection:bg-indigo-500/30">
      
      {/* Background Effects matching Home/Register */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
        <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/30 blur-[100px]" />
        <div className="absolute top-20 right-0 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/20 blur-[100px]" />
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp .7s cubic-bezier(.2,.9,.3,1) both; }
        
        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6 55%, #d946ef);
          background-size: 200% auto;
          transition: background-position .5s, transform .25s, box-shadow .3s;
          box-shadow: 0 12px 30px -10px rgba(139,92,246,.6);
        }
        .btn-primary:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-2px);
          box-shadow: 0 18px 40px -12px rgba(217,70,239,.7);
        }
        .btn-primary:disabled { opacity: .5; cursor: not-allowed; }

        .btn-secondary {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.1);
          transition: all .25s;
        }
        .btn-secondary:hover:not(:disabled) {
          background: rgba(255,255,255,.08);
          border-color: rgba(255,255,255,.2);
        }
      `}</style>

      <div className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-5 py-6 animate-fade-up">
        <Link to="/" className="group flex items-center gap-2.5 font-bold text-white">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40 transition-transform duration-500 group-hover:rotate-[10deg]">
            <Sparkles className="size-4" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            CareerPilot <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
          </span>
        </Link>
        <span className="text-sm font-medium text-slate-400">
          Step <span className="text-indigo-400">{step + 1}</span> of {STEPS.length}
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-xl px-5 pb-14">
        {/* Progress bar */}
        <div className="animate-fade-up mb-10 flex gap-2">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-500 ease-out ${i < step ? 'w-full' : i === step ? 'w-1/2' : 'w-0'}`} />
            </div>
          ))}
        </div>

        <p className="animate-fade-up text-xs font-bold uppercase tracking-[.25em] text-indigo-400">{STEPS[step].eyebrow}</p>
        <h1 className="animate-fade-up mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{STEPS[step].title}</h1>
        <p className="animate-fade-up mt-3 text-sm text-slate-400">Choose the options that feel closest. You can refine these later.</p>

        <div className="mt-8 flex flex-col gap-8 animate-fade-up">
          {step === 0 && (
            <>
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-300">Education level</p>
                <SingleSelect options={EDUCATION_LEVELS} value={form.educationLevel} onChange={set('educationLevel')} />
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-300">Degree or field</p>
                <SingleSelect options={DEGREES} value={form.degree} onChange={set('degree')} />
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-300">Expected graduation year</p>
                <SingleSelect options={GRAD_YEARS} value={form.graduationYear} onChange={set('graduationYear')} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-300">Your experience level</p>
                <SingleSelect options={EXPERIENCE_LEVELS} value={form.experienceLevel} onChange={set('experienceLevel')} />
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-300">Technical skills you already have <span className="text-slate-500 font-normal text-xs">(select all that apply)</span></p>
                <MultiSelect options={SKILLS} value={form.technicalSkills} onChange={set('technicalSkills')} />
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-300">Areas of interest</p>
                <MultiSelect options={INTERESTS} value={form.interests} onChange={set('interests')} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-300">Target roles <span className="text-slate-500 font-normal text-xs">(up to 3)</span></p>
                <MultiSelect options={TARGET_ROLES} value={form.targetRoles} onChange={set('targetRoles')} limit={3} />
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-300">Skills you want to learn</p>
                <MultiSelect options={SKILLS} value={form.skillsToLearn} onChange={set('skillsToLearn')} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Career goal (optional)</label>
                <textarea
                  value={form.careerGoals}
                  onChange={(e) => set('careerGoals')(e.target.value)}
                  placeholder="e.g. Land a junior frontend developer role at a product company within 12 months."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 transition-all focus:border-indigo-500/50 focus:bg-indigo-500/[.05] focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-300">How many hours per week can you dedicate to learning?</p>
              <SingleSelect options={WEEKLY_TIMES} value={form.weeklyLearningTime} onChange={set('weeklyLearningTime')} />
            </div>
          )}

          {error && <Alert type="error">{error}</Alert>}

          <div className="mt-2 flex gap-3">
            {step > 0 && (
              <button 
                onClick={() => setStep(step - 1)} 
                disabled={saving}
                className="btn-secondary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-300"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
            )}
            
            {step < STEPS.length - 1 ? (
              <button 
                onClick={() => saveStep(step + 1)} 
                disabled={saving || !canAdvance} 
                className="btn-primary group flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
              >
                {saving ? 'Saving...' : 'Continue'}
                {!saving && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
              </button>
            ) : (
              <button 
                onClick={finish} 
                disabled={saving || !canAdvance} 
                className="btn-primary group flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
              >
                {saving ? 'Saving...' : 'Finish my profile'}
                {!saving && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}