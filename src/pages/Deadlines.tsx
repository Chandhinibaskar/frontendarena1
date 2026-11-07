import { Link } from 'react-router-dom'
import { SCHOLARSHIPS } from '../data/scholarships'
import { useStore } from '../store/useStore'
import { useT } from '../lib/i18n'
import { fmtDate, money } from '../lib/match'
import { DaysBadge } from '../components/ui'

export default function Deadlines() {
  const t = useT()
  const { apps, lang } = useStore()
  const list = [...SCHOLARSHIPS].sort((a, b) => a.days - b.days)
  return (
    <section className="panel p-5">
      <h1 className="mb-4 font-pixel text-xl">{t('deadlines')}</h1>
      <ol className="relative ms-3 border-s-4 border-slate-200">
        {list.map((s) => {
          const color = s.days <= 7 ? '#f43f5e' : s.days <= 21 ? '#f59e0b' : '#22c55e'
          return (
            <li key={s.id} className="mb-4 ms-5">
              <span className="absolute -start-[.6rem] mt-1 h-4 w-4 rounded-sm border-2 border-white" style={{ background: color }} aria-hidden="true" />
              <div className="flex flex-wrap items-center gap-2">
                <time className="font-pixel text-xs">{fmtDate(s.days, lang)}</time>
                <Link to={`/s/${s.id}`} className="font-bold hover:underline">{s.name}</Link>
                <DaysBadge days={s.days} />
                <span className="chip bg-amber-100 text-amber-800">{money(s.amount)}</span>
                {apps[s.id] && <span className="chip bg-sky-100 text-sky-800">{t('yours')}</span>}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
