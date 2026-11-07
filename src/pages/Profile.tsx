import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check } from 'lucide-react'
import { COUNTRIES, FIELDS, LEVELS } from '../data/scholarships'
import { useStore } from '../store/useStore'
import { useT } from '../lib/i18n'
import { clamp, sanitizeText } from '../lib/sanitize'
import type { Level } from '../types'
import Select from '../components/Select'

const toOptions = (list: string[]) => list.map((v) => ({ value: v, label: v }))

export default function Profile() {
  const t = useT()
  const profile = useStore((s) => s.profile)
  const setProfile = useStore((s) => s.setProfile)
  const [p, setP] = useState(profile)
  const [ok, setOk] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const clean = { ...p, name: sanitizeText(p.name, 40).trim() || 'Scholar', gpa: clamp(p.gpa, 0, 4), income: clamp(p.income, 0, 10_000_000) }
    setProfile(clean)
    setP(clean)
    setOk(true)
    setTimeout(() => setOk(false), 2500)
  }

  return (
    <form className="panel mx-auto grid max-w-2xl gap-4 p-5 sm:grid-cols-2" onSubmit={submit} noValidate>
      <div className="sm:col-span-2"><h1 className="font-pixel text-xl">{t('profile')}</h1><p className="text-sm text-slate-700">{t('profileHint')}</p></div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="pname">{t('name')}</label>
        <input id="pname" className="field font-normal" maxLength={40} autoComplete="name" value={p.name} onChange={(e) => setP({ ...p, name: sanitizeText(e.target.value, 40) })} />
      </div>
      <Select label={t('level')} value={p.level} onChange={(v) => setP({ ...p, level: v as Level })} options={toOptions(LEVELS)} />
      <Select label={t('field')} value={p.field} onChange={(v) => setP({ ...p, field: v })} options={toOptions(FIELDS.slice(1))} />
      <Select label={t('country')} value={p.country} onChange={(v) => setP({ ...p, country: v })} options={toOptions(COUNTRIES.slice(1))} />
      <div>
        <label className="label" htmlFor="gpa">{t('gpa')}</label>
        <input id="gpa" className="field font-normal" type="number" inputMode="decimal" min={0} max={4} step={0.1} value={p.gpa} onChange={(e) => setP({ ...p, gpa: Number(e.target.value) })} />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="income">{t('income')}</label>
        <input id="income" className="field font-normal" type="number" inputMode="numeric" min={0} max={10000000} step={1000} value={p.income} onChange={(e) => setP({ ...p, income: Number(e.target.value) })} />
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button className="pix pix-blue" type="submit">{t('saveProfile')}</button>
        <span role="status" aria-live="polite" className="flex items-center gap-1 text-sm font-bold text-emerald-800">
          {ok && <><Check size={16} aria-hidden="true" />{t('profileSaved')}</>}
        </span>
      </div>
    </form>
  )
}
