import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { COUNTRIES, FIELDS, LEVELS, SCHOLARSHIPS } from '../data/scholarships'
import { useStore } from '../store/useStore'
import { useT } from '../lib/i18n'
import { score } from '../lib/match'
import { sanitizeText } from '../lib/sanitize'
import { ScholarshipCard } from '../components/ui'
import Select from '../components/Select'

const toOptions = (list: string[]) => list.map((v) => ({ value: v, label: v }))

export default function Discover() {
  const t = useT()
  const profile = useStore((s) => s.profile)
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('')
  const [field, setField] = useState('')
  const [country, setCountry] = useState('')
  const [sort, setSort] = useState('match')

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return SCHOLARSHIPS
      .filter((s) =>
        (!needle || `${s.name} ${s.provider} ${s.description}`.toLowerCase().includes(needle)) &&
        (!level || s.level === level) && (!field || s.field === field) && (!country || s.country === country))
      .sort((a, b) => sort === 'amount' ? b.amount - a.amount : sort === 'deadline' ? a.days - b.days : score(b, profile) - score(a, profile))
  }, [q, level, field, country, sort, profile])

  const all = { value: '', label: t('all') }
  return (
    <div className="grid gap-4">
      <section className="panel grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5" aria-label={t('discover')}>
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="label" htmlFor="q">{t('discover')}</label>
          <div className="relative">
            <Search size={16} aria-hidden="true" className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input id="q" type="search" maxLength={60} autoComplete="off" className="field ps-9" placeholder={t('search')}
              value={q} onChange={(e) => setQ(sanitizeText(e.target.value))} />
          </div>
        </div>
        <Select label={t('level')} value={level} onChange={setLevel} options={[all, ...toOptions(LEVELS)]} />
        <Select label={t('field')} value={field} onChange={setField} options={[all, ...toOptions(FIELDS.slice(1))]} />
        <Select label={t('country')} value={country} onChange={setCountry} options={[all, ...toOptions(COUNTRIES)]} />
        <Select label={t('sort')} value={sort} onChange={setSort}
          options={[{ value: 'match', label: t('sortMatch') }, { value: 'amount', label: t('sortAmount') }, { value: 'deadline', label: t('sortDeadline') }]} />
      </section>
      <p className="sr-only" role="status" aria-live="polite">{list.length} / {SCHOLARSHIPS.length}</p>
      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((s) => <ScholarshipCard key={s.id} s={s} />)}</div>
      ) : <p className="panel p-6 text-center font-semibold" role="status">{t('noResults')}</p>}
    </div>
  )
}
