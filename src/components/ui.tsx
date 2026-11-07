import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import type { Scholarship } from '../types'
import { useStore } from '../store/useStore'
import { useT } from '../lib/i18n'
import { fmtDate, money, score } from '../lib/match'

export function Ring({ v, size = 52 }: { v: number; size?: number }) {
  const t = useT()
  return (
    <div role="img" aria-label={`${v}% ${t('match')}`} className="grid shrink-0 place-items-center rounded-full"
      style={{ width: size, height: size, background: `conic-gradient(#22c55e ${v * 3.6}deg, #e2e8f0 0)` }}>
      <div className="grid place-items-center rounded-full bg-white font-pixel text-[.65rem]" style={{ width: size - 12, height: size - 12 }}>{v}%</div>
    </div>
  )
}

export function DaysBadge({ days }: { days: number }) {
  const t = useT()
  const tone = days <= 7 ? 'bg-rose-100 text-rose-800' : days <= 21 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
  return <span className={`chip ${tone}`}>{days} {t('daysLeft')}</span>
}

export function ScholarshipCard({ s }: { s: Scholarship }) {
  const t = useT()
  const { profile, apps, save, remove } = useStore()
  const on = !!apps[s.id]
  return (
    <article className="panel flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-pixel text-sm leading-snug">{s.name}</h3>
          <p className="text-xs text-slate-600">{s.provider} · {s.country}</p>
        </div>
        <Ring v={score(s, profile)} />
      </div>
      <p className="line-clamp-2 text-sm text-slate-700">{s.description}</p>
      <div className="flex flex-wrap gap-2">
        <span className="chip">{s.level}</span><span className="chip">{s.field}</span>
        <span className="chip bg-amber-100 text-amber-800">{money(s.amount)}</span>
        <DaysBadge days={s.days} />
      </div>
      <div className="mt-auto flex gap-2 pt-1">
        <Link className="pix flex-1" to={`/s/${s.id}`}>{t('inspect')}</Link>
        <button className={`pix ${on ? 'pix-gold' : 'pix-blue'}`} aria-pressed={on} onClick={() => (on ? remove(s.id) : save(s.id))}>
          <Bookmark size={14} aria-hidden="true" />{on ? t('unsave') : t('save')}
        </button>
      </div>
    </article>
  )
}

export function DeadlineRow({ s }: { s: Scholarship }) {
  const lang = useStore((x) => x.lang)
  return (
    <li>
      <Link to={`/s/${s.id}`} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-100">
        <span className="font-pixel w-14 shrink-0 text-xs">{fmtDate(s.days, lang)}</span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{s.name}</span>
        <DaysBadge days={s.days} />
      </Link>
    </li>
  )
}
