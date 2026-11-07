import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, X } from 'lucide-react'
import { SCHOLARSHIPS } from '../data/scholarships'
import { useStore } from '../store/useStore'
import { useT } from '../lib/i18n'
import { checks, fmtDate, money, score } from '../lib/match'
import { DaysBadge, Ring } from '../components/ui'

export default function Detail() {
  const t = useT()
  const nav = useNavigate()
  const { id } = useParams()
  const { profile, apps, lang, save, remove, setStatus } = useStore()
  const s = SCHOLARSHIPS.find((x) => x.id === id)
  if (!s) return <p className="panel p-6 font-semibold">{t('notFound')} <Link className="underline" to="/discover">{t('back')}</Link></p>
  const on = !!apps[s.id]
  return (
    <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
      <article className="panel p-5">
        <Link to="/discover" className="pix mb-4"><ArrowLeft size={14} aria-hidden="true" className="rtl:rotate-180" />{t('back')}</Link>
        <h1 className="font-pixel text-xl sm:text-2xl">{s.name}</h1>
        <p className="mt-1 text-sm text-slate-600">{s.provider} · {s.country}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="chip">{s.level}</span><span className="chip">{s.field}</span>
          <span className="chip bg-amber-100 text-amber-800">{money(s.amount)}</span>
          <span className="chip">{fmtDate(s.days, lang)}</span><DaysBadge days={s.days} />
        </div>
        <p className="mt-4 max-w-prose leading-relaxed">{s.description}</p>
        <h2 className="mt-6 font-pixel text-sm">{t('steps')}</h2>
        <ol className="mt-2 list-decimal space-y-1 ps-5 text-sm">{s.steps.map((x) => <li key={x}>{x}</li>)}</ol>
        <h2 className="mt-6 font-pixel text-sm">{t('documents')}</h2>
        <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
          {s.docs.map((d) => <li key={d} className="flex items-center gap-2"><Check size={14} aria-hidden="true" className="text-sky-600" />{d}</li>)}
        </ul>
      </article>
      <aside className="panel h-fit p-5">
        <div className="flex items-center gap-3"><Ring v={score(s, profile)} size={72} /><p className="font-pixel text-sm">{t('eligibility')}</p></div>
        <ul className="mt-4 space-y-2">
          {checks(s, profile).map(([k, ok]) => (
            <li key={k} className="flex items-center gap-2 text-sm font-semibold">
              {ok ? <Check size={16} aria-label={t('met')} className="text-emerald-600" /> : <X size={16} aria-label={t('notMet')} className="text-rose-600" />}{t(k)}
            </li>
          ))}
        </ul>
        <div className="mt-5 grid gap-2">
          <button className="pix pix-blue" onClick={() => { setStatus(s.id, 'progress'); nav('/tracker') }}>{t('start')}</button>
          <button className="pix" aria-pressed={on} onClick={() => (on ? remove(s.id) : save(s.id))}>{on ? t('unsave') : t('save')}</button>
        </div>
      </aside>
    </div>
  )
}
