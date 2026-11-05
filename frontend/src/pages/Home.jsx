import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Target,
  Flame,
  BriefcaseBusiness,
  Sparkles,
  CheckCircle,
  Star,
  Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

const FEATURES = [
  { icon: Target, title: 'Career Assessment', desc: 'Discover which careers align with your skills and interests.', accent: 'from-indigo-500 to-blue-500' },
  { icon: Flame, title: 'Personalized Roadmap', desc: 'Get a step-by-step learning plan built around your goals.', accent: 'from-orange-500 to-pink-500' },
  { icon: BriefcaseBusiness, title: 'AI Resume Analyzer', desc: 'Upload your resume and get actionable, specific feedback.', accent: 'from-emerald-500 to-teal-500' },
  { icon: Sparkles, title: 'Mock Interviews', desc: 'Practice with an AI interviewer and get scored feedback.', accent: 'from-violet-500 to-fuchsia-500' },
]

const BENEFITS = [
  'Role-specific learning roadmaps',
  'AI-powered resume analysis',
  'Mock interviews with real feedback',
  'Career mentor chatbot',
  'Skill assessments with explanations',
  'Job application tracker',
]

export default function Home() {
  const { user } = useAuth()

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white text-slate-900 antialiased transition-colors duration-300 dark:bg-[#06070f] dark:text-slate-100">
      
      {/* ── Global styles ── */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform: scale(.94); } to { opacity:1; transform: scale(1); } }
        @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes pulseGlow { 0%,100% { opacity:.35 } 50% { opacity:.65 } }

        .reveal { animation: fadeUp .9s cubic-bezier(.2,.9,.3,1) both; }
        .pop { animation: scaleIn .7s cubic-bezier(.2,.9,.3,1) both; }
        .d1{animation-delay:.08s}.d2{animation-delay:.16s}.d3{animation-delay:.24s}
        .d4{animation-delay:.32s}.d5{animation-delay:.4s}.d6{animation-delay:.48s}.d7{animation-delay:.56s}

        .animated-text {
          background: linear-gradient(90deg,#818cf8,#c084fc,#22d3ee,#818cf8);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: shimmer 6s linear infinite;
        }
        .light .animated-text {
          background: linear-gradient(90deg,#4f46e5,#9333ea,#0891b2,#4f46e5);
          background-size: 200% auto;
        }

        .glass {
          background: rgba(255,255,255,.6);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(0,0,0,.08);
          transition: all .3s;
        }
        .dark .glass {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
        }

        .feature-tile {
          position: relative;
          border-radius: 1.5rem;
          background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.7));
          border: 1px solid rgba(0,0,0,.06);
          transition: transform .45s cubic-bezier(.2,.9,.3,1), box-shadow .45s, border-color .3s, background .3s;
          overflow: hidden;
        }
        .dark .feature-tile {
          background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
          border: 1px solid rgba(255,255,255,.08);
        }
        .feature-tile:hover { transform: translateY(-8px); box-shadow: 0 30px 60px -20px rgba(99,102,241,.25); }
        .dark .feature-tile:hover { box-shadow: 0 30px 60px -20px rgba(99,102,241,.45); }

        .btn-glow {
          background: linear-gradient(135deg, #6366f1, #8b5cf6 55%, #d946ef);
          background-size: 200% auto;
          transition: background-position .5s, transform .25s, box-shadow .3s;
          box-shadow: 0 12px 30px -10px rgba(139,92,246,.4);
        }
        .btn-glow:hover { background-position: right center; transform: translateY(-2px); box-shadow: 0 18px 40px -12px rgba(217,70,239,.6); }
        .dark .btn-glow { box-shadow: 0 12px 30px -10px rgba(139,92,246,.7); }

        .pill { transition: all .3s cubic-bezier(.2,.9,.3,1); }
        .pill:hover { transform: translateX(6px); }
        .pill:hover { background: rgba(99,102,241,.06); border-color: rgba(99,102,241,.3); }
        .dark .pill:hover { background: rgba(129,140,248,.12); border-color: rgba(129,140,248,.5); }

        .nav-underline { position: relative; }
        .nav-underline::after {
          content:''; position:absolute; left:0; bottom:-4px; height:2px; width:0;
          background: linear-gradient(90deg,#818cf8,#c084fc);
          transition: width .3s cubic-bezier(.2,.9,.3,1); border-radius: 2px;
        }
        .nav-underline:hover::after { width: 100%; }

        .grid-lines {
          background-image:
            linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,.04) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%);
          opacity: 0;
          transition: opacity .4s;
        }
        .dark .grid-lines {
          background-image:
            linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
          opacity: 1;
        }

        .orb { position:absolute; border-radius:9999px; filter: blur(90px); pointer-events:none; animation: pulseGlow 9s ease-in-out infinite; opacity: 0; transition: opacity .5s; }
        .dark .orb { opacity: 1; }
      `}</style>

      {/* ── Background layers ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-lines" />
        <div className="orb left-[-8rem] top-[-8rem] h-[34rem] w-[34rem] bg-indigo-600/40" />
        <div className="orb right-[-10rem] top-[10rem] h-[30rem] w-[30rem] bg-fuchsia-600/30" style={{ animationDelay: '-3s' }} />
        <div className="orb left-1/3 top-[40rem] h-[26rem] w-[26rem] bg-cyan-500/25" style={{ animationDelay: '-6s' }} />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40 transition-transform duration-500 group-hover:rotate-[10deg]">
              <Sparkles className="size-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              CareerPilot <span className="animated-text">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            <a href="#features" className="nav-underline hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#benefits" className="nav-underline hover:text-slate-900 dark:hover:text-white transition-colors">Benefits</a>
            <a href="#pricing" className="nav-underline hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <Link to="/dashboard" className="btn-glow rounded-xl px-5 py-2.5 font-semibold text-white">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors sm:inline">
                  Sign in
                </Link>
                <Link to="/register" className="btn-glow rounded-xl px-5 py-2.5 font-semibold text-white">
                  Get started
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-5xl px-5 pb-20 pt-20 text-center sm:pt-28">
        <div className="reveal d1 mx-auto inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          Trusted by 10,000+ students
        </div>

        <h1 className="reveal d2 mx-auto mt-6 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-7xl">
          Make your next step{' '}
          <span className="animated-text">clear.</span>
        </h1>

        <p className="reveal d3 mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
          CareerPilot helps students find direction, build the right skills, and
          get career-ready with a plan made just for them.
        </p>

        <div className="reveal d4 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/register"
            className="btn-glow group inline-flex items-center rounded-xl px-7 py-3.5 text-sm font-semibold text-white"
          >
            Build my roadmap
            <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/login"
            className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all hover:border-indigo-400/40 dark:hover:bg-white/10"
          >
            <Zap className="size-4 text-indigo-500 dark:text-indigo-400" />
            Already have an account?
          </Link>
        </div>

        {/* Hero preview card */}
        <div className="reveal d5 relative mx-auto mt-16 max-w-3xl">
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/15 to-cyan-500/20 blur-2xl dark:from-indigo-500/30 dark:via-fuchsia-500/20 dark:to-cyan-500/30" />
          <div className="relative rounded-[2rem] glass p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-4 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-400/80" />
                <span className="size-3 rounded-full bg-amber-400/80" />
                <span className="size-3 rounded-full bg-emerald-400/80" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">careerpilot.ai / roadmap</span>
            </div>
            <div className="mt-6 grid gap-4 text-left sm:grid-cols-3">
              {[
                { label: 'Frontend Engineer', value: '68%', w: 'w-2/3', c: 'from-indigo-500 to-violet-500' },
                { label: 'Skills mastered', value: '14 / 21', w: 'w-3/4', c: 'from-fuchsia-500 to-pink-500' },
                { label: 'Interviews ready', value: '9.2/10', w: 'w-5/6', c: 'from-cyan-500 to-teal-500' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-slate-200/60 bg-white/40 p-4 dark:border-white/10 dark:bg-white/[.03]">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{s.value}</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/50 dark:bg-white/10">
                    <div className={`h-full ${s.w} rounded-full bg-gradient-to-r ${s.c}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="reveal d1 text-xs font-bold uppercase tracking-[.25em] text-indigo-600 dark:text-indigo-400">
            The toolkit
          </p>
          <h2 className="reveal d2 mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything you need to get hired
          </h2>
          <p className="reveal d3 mt-4 text-slate-600 dark:text-slate-400">
            Four powerful tools that work together to take you from confused to career-ready.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, desc, accent }, i) => (
            <div
              key={title}
              className={`feature-tile pop d${i + 2} group p-7 text-left`}
            >
              <div className={`mb-5 inline-grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}>
                <Icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                Learn more <ArrowRight className="size-3.5" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ── */}
      <section id="benefits" className="mx-auto max-w-5xl px-5 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="reveal d1 text-xs font-bold uppercase tracking-[.25em] text-fuchsia-600 dark:text-fuchsia-400">
              Why CareerPilot
            </p>
            <h2 className="reveal d2 mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              A complete path to your{' '}
              <span className="animated-text">first job</span>
            </h2>
            <p className="reveal d3 mt-4 text-slate-600 dark:text-slate-400">
              No more guessing what to learn next. Every step is mapped, measured, and personalized to you.
            </p>
            <div className="reveal d4 mt-8 flex items-center gap-3 rounded-2xl glass p-4">
              <div className="flex -space-x-2">
                {['from-indigo-500 to-blue-500', 'from-fuchsia-500 to-pink-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500'].map((c, i) => (
                  <span key={i} className={`size-9 rounded-full border-2 border-white dark:border-[#0b0d1a] bg-gradient-to-br ${c}`} />
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 text-amber-500 dark:text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Loved by students at 200+ universities</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {BENEFITS.map((b, i) => (
              <div
                key={b}
                className={`pill pop d${i + 2} flex items-center gap-3 rounded-xl border border-slate-200 bg-white/60 px-4 py-3.5 dark:border-white/10 dark:bg-white/[.03] transition-colors`}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                  <CheckCircle className="size-4" />
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-200">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section id="pricing" className="mx-auto max-w-5xl px-5 py-20">
        <div className="reveal relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 p-10 text-center dark:border-white/10 dark:from-indigo-600/20 dark:via-violet-600/10 dark:to-fuchsia-600/20 sm:p-16 transition-colors">
          <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-500/30" />
          <h2 className="relative text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Your future starts with one step.
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-slate-600 dark:text-slate-300">
            Join thousands of students building their careers with confidence. Free to start, no card required.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="btn-glow group inline-flex items-center rounded-xl px-7 py-3.5 text-sm font-semibold text-white"
            >
              Start for free
              <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:text-slate-900 dark:hover:text-white"
            >
              Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-500 transition-colors">
        © {new Date().getFullYear()} CareerPilot AI. All rights reserved.
      </footer>
    </main>
  )
}