import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarClock, Coins, Compass, LayoutDashboard, ListChecks, UserRound } from 'lucide-react'
import { useStore } from '../store/useStore'
import { LANGS, useT } from '../lib/i18n'
import type { Lang } from '../types'
import type { Theme } from '../scene/World'
import ErrorBoundary from './ErrorBoundary'
import Nudge from './Nudge'

const World = lazy(() => import('../scene/World'))

const NAV = [
  { to: '/', key: 'dashboard', Icon: LayoutDashboard },
  { to: '/discover', key: 'discover', Icon: Compass },
  { to: '/tracker', key: 'tracker', Icon: ListChecks },
  { to: '/deadlines', key: 'deadlines', Icon: CalendarClock },
  { to: '/profile', key: 'profile', Icon: UserRound },
]

const themeFor = (p: string): Theme =>
  p.startsWith('/tracker') ? 'sunset' : p === '/' || p.startsWith('/deadlines') ? 'city' : 'cosmos'

// CSS gradients shown instantly (and when WebGL is unavailable) so the first paint never waits for 3D
const GRADIENT: Record<Theme, string> = {
  city: 'linear-gradient(#2f9aa0, #1f6b3a)',
  cosmos: 'linear-gradient(#0a0720, #1a1040)',
  sunset: 'linear-gradient(#ff9770, #c9184a)',
}

const titleKey = (p: string) => (NAV.find((n) => n.to !== '/' && p.startsWith(n.to))?.key ?? (p.startsWith('/s/') ? 'discover' : 'dashboard'))

function Clock() {
  const lang = useStore((s) => s.lang)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(i) }, [])
  return <div className="pix hidden sm:inline-flex">{now.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}</div>
}

export default function Layout() {
  const t = useT()
  const loc = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)
  const coins = useStore((s) => s.coins)
  const theme = themeFor(loc.pathname)
  const [show3d, setShow3d] = useState(false)

  // mount the heavy 3D canvas only after the first paint (better LCP / INP)
  useEffect(() => { const id = window.setTimeout(() => setShow3d(true), 150); return () => clearTimeout(id) }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  // per-route title + move focus to the content for keyboard / screen-reader users
  const key = titleKey(loc.pathname)
  useEffect(() => { document.title = `${t(key)} · GRANTLY` }, [key, t])
  useEffect(() => { mainRef.current?.focus({ preventScroll: true }) }, [loc.pathname])

  return (
    <div className="relative min-h-screen">
      <a href="#main" className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-bold focus:not-sr-only focus:fixed focus:start-4 focus:top-4">{t('skip')}</a>
      <div aria-hidden="true" className="fixed inset-0 -z-20" style={{ background: GRADIENT[theme] }} />
      {show3d && (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}><World key={theme} theme={theme} /></Suspense>
        </ErrorBoundary>
      )}

      <header className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 pt-4">
        <Link to="/" className="me-auto rounded-xl bg-slate-900/70 px-3 py-1.5">
          <span className="block font-pixel text-2xl font-bold tracking-widest text-white sm:text-3xl">GRANTLY</span>
          <span className="block max-w-56 text-[.65rem] font-bold uppercase tracking-wider text-white">{t('tagline')}</span>
        </Link>
        <div className="pix pix-gold" role="status" aria-label={`${coins} ${t('coins')}`}><Coins size={14} aria-hidden="true" />{coins}</div>
        <Clock />
        <label className="sr-only" htmlFor="lang">{t('language')}</label>
        <select id="lang" className="pix" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
          {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </header>

      <nav aria-label={t('mainNav')} className="mx-auto mt-3 max-w-6xl px-4">
        <ul className="panel flex gap-2 overflow-x-auto p-2">
          {NAV.map(({ to, key: k, Icon }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} className={({ isActive }) => `pix ${isActive ? 'pix-blue' : ''}`}>
                <Icon size={14} aria-hidden="true" />{t(k)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <motion.main id="main" ref={mainRef} tabIndex={-1} key={loc.pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }} className="mx-auto max-w-6xl px-4 pb-32 pt-5 outline-none">
        <ErrorBoundary>
          <Suspense fallback={<p role="status" className="panel p-4 font-semibold">{t('loading')}</p>}><Outlet /></Suspense>
        </ErrorBoundary>
      </motion.main>
      <Nudge />
    </div>
  )
}
