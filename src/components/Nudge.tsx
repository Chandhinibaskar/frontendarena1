import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ChevronDown } from 'lucide-react'
import { SCHOLARSHIPS } from '../data/scholarships'
import { useStore } from '../store/useStore'
import { useT } from '../lib/i18n'
import { DaysBadge } from './ui'

export default function Nudge() {
  const t = useT()
  const apps = useStore((s) => s.apps)
  const [open, setOpen] = useState(true)
  const byDays = [...SCHOLARSHIPS].sort((a, b) => a.days - b.days)
  const s = byDays.find((x) => apps[x.id] && ['saved', 'progress'].includes(apps[x.id].status)) ?? byDays[0]
  return (
    <aside className="panel fixed bottom-4 start-4 z-20 hidden w-80 md:block" aria-label={t('nudge')}>
      <button className="flex w-full items-center gap-2 px-3 py-2 text-start font-pixel text-xs" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Bell size={14} aria-hidden="true" className="text-amber-500" />
        <span className="flex-1">{t('nudge')}</span>
        <ChevronDown size={16} aria-hidden="true" className={open ? '' : 'rotate-180'} />
      </button>
      {open && (
        <div className="flex items-center gap-2 border-t border-slate-200 px-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{s.name}</p>
            <DaysBadge days={s.days} />
          </div>
          <Link to={`/s/${s.id}`} className="pix pix-blue">{t('inspect')}</Link>
        </div>
      )}
    </aside>
  )
}
