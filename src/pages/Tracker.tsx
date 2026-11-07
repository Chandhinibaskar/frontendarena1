import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SCHOLARSHIPS } from '../data/scholarships'
import { useStore } from '../store/useStore'
import { useT } from '../lib/i18n'
import { STATUSES } from '../types'
import type { Status } from '../types'
import { DaysBadge } from '../components/ui'

const COLS = STATUSES
const TONE: Record<Status, string> = { saved: '#38bdf8', progress: '#f59e0b', submitted: '#8b5cf6', awarded: '#22c55e', rejected: '#f43f5e' }

export default function Tracker() {
  const t = useT()
  const { apps, setStatus, toggleDoc, remove } = useStore()
  const [drag, setDrag] = useState<string | null>(null)
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {COLS.map((col) => {
        const items = SCHOLARSHIPS.filter((s) => apps[s.id]?.status === col)
        return (
          <section key={col} aria-label={t('col_' + col)} className="panel min-h-40 p-3"
            onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag) setStatus(drag, col); setDrag(null) }}>
            <h2 className="mb-3 flex items-center gap-2 font-pixel text-xs">
              <span className="h-3 w-3 rounded-sm" style={{ background: TONE[col] }} aria-hidden="true" />{t('col_' + col)}
              <span className="chip ms-auto">{items.length}</span>
            </h2>
            {!items.length && <p className="rounded-lg border-2 border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">{t('empty')}</p>}
            <ul className="grid gap-3">
              {items.map((s) => {
                const a = apps[s.id]; const done = a.checked.length
                return (
                  <li key={s.id} draggable onDragStart={() => setDrag(s.id)} className="cursor-grab rounded-xl border-2 border-slate-200 bg-white p-3 active:cursor-grabbing">
                    <Link to={`/s/${s.id}`} className="text-sm font-bold hover:underline">{s.name}</Link>
                    <div className="mt-1"><DaysBadge days={s.days} /></div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={done} aria-valuemax={s.docs.length} aria-label={t('docsReady')}>
                      <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(done / s.docs.length) * 100}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{done}/{s.docs.length} {t('docsReady')}</p>
                    <details className="mt-2 text-sm">
                      <summary className="cursor-pointer font-semibold">{t('documents')}</summary>
                      <ul className="mt-1 space-y-1">
                        {s.docs.map((d) => (
                          <li key={d}><label className="flex items-center gap-2"><input type="checkbox" checked={a.checked.includes(d)} onChange={() => toggleDoc(s.id, d)} />{d}</label></li>
                        ))}
                      </ul>
                    </details>
                    <label className="mt-2 block text-xs font-bold">{t('move')}
                      <select className="field mt-1 !py-1 font-normal" value={col} onChange={(e) => setStatus(s.id, e.target.value as Status)}>
                        {COLS.map((c) => <option key={c} value={c}>{t('col_' + c)}</option>)}
                      </select>
                    </label>
                    <button className="pix pix-red mt-2 w-full" onClick={() => remove(s.id)}>{t('unsave')}</button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
