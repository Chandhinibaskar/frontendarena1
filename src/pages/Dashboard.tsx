import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, CalendarClock, Coins, Send } from 'lucide-react'
import { SCHOLARSHIPS } from '../data/scholarships'
import { useStore } from '../store/useStore'
import { useT } from '../lib/i18n'
import { score } from '../lib/match'
import { DeadlineRow, ScholarshipCard } from '../components/ui'

export default function Dashboard() {
  const t = useT()
  const { profile, apps, coins } = useStore()
  const top = useMemo(() => [...SCHOLARSHIPS].sort((a, b) => score(b, profile) - score(a, profile)).slice(0, 3), [profile])
  const upcoming = [...SCHOLARSHIPS].sort((a, b) => a.days - b.days).slice(0, 6)
  const ids = Object.keys(apps)
  const applied = ids.filter((i) => ['submitted', 'awarded', 'rejected'].includes(apps[i].status)).length
  const due = SCHOLARSHIPS.filter((s) => s.days <= 7 && apps[s.id] && ['saved', 'progress'].includes(apps[s.id].status)).length
  const stats = [
    { l: t('saved'), v: ids.length, I: Bookmark }, { l: t('applied'), v: applied, I: Send },
    { l: t('dueWeek'), v: due, I: CalendarClock }, { l: t('coins'), v: coins, I: Coins },
  ]
  return (
    <div className="grid gap-5">
      <section className="panel p-5">
        <h1 className="font-pixel text-xl sm:text-2xl">{t('welcome')}, {profile.name}</h1>
        <p className="mt-1 text-sm text-slate-600">{t('subtitle')}</p>
        <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(({ l, v, I }) => (
            <li key={l} className="flex items-center gap-3 rounded-xl bg-slate-100 p-3">
              <I size={22} aria-hidden="true" className="text-sky-600" />
              <div><div className="font-pixel text-lg">{v}</div><div className="text-xs font-semibold text-slate-600">{l}</div></div>
            </li>
          ))}
        </ul>
      </section>
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <section aria-labelledby="top">
          <h2 id="top" className="mb-2 font-pixel text-sm text-white drop-shadow-[0_2px_0_rgba(0,0,0,.5)]">{t('topMatches')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3">
            {top.map((s) => <ScholarshipCard key={s.id} s={s} />)}
          </div>
        </section>
        <section aria-labelledby="up" className="panel h-fit p-4">
          <h2 id="up" className="mb-2 font-pixel text-sm">{t('upcoming')}</h2>
          <ul>{upcoming.map((s) => <DeadlineRow key={s.id} s={s} />)}</ul>
          <Link to="/deadlines" className="pix mt-3 w-full">{t('deadlines')}</Link>
        </section>
      </div>
    </div>
  )
}
