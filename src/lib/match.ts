import type { Profile, Scholarship } from '../types'

// Each check maps to an i18n key
export const checks = (s: Scholarship, p: Profile): [string, boolean][] => [
  ['level', p.level === s.level],
  ['field', s.field === 'Any' || s.field === p.field],
  ['country', s.country === 'Global' || s.country === p.country],
  ['elig_gpa', p.gpa >= s.minGpa],
  ['elig_income', p.income <= s.maxIncome],
]
const W = [30, 25, 15, 15, 15]
export const score = (s: Scholarship, p: Profile) =>
  checks(s, p).reduce((a, [, ok], i) => a + (ok ? W[i] : 0), 0)

export const fmtDate = (days: number, lang: string) =>
  new Date(Date.now() + days * 864e5).toLocaleDateString(lang, { day: 'numeric', month: 'short' })
export const money = (n: number) => '$' + n.toLocaleString('en-US')
