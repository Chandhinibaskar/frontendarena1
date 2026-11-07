import { COUNTRIES, FIELDS, LEVELS, SCHOLARSHIPS } from '../data/scholarships'
import { STATUSES } from '../types'
import type { AppEntry, Level, Profile, Status } from '../types'

/** Strips HTML tags, angle brackets and control characters, collapses whitespace and limits length. */
export function sanitizeText(value: unknown, max = 60): string {
  return String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .split('')
    .filter((ch) => ch.charCodeAt(0) > 31 && ch.charCodeAt(0) !== 127 || ch === '\n' || ch === '\t')
    .join('')
    .replace(/\s+/g, ' ')
    .trimStart()
    .slice(0, max)
}

/** Clamps to [min, max]; non-finite input returns `fallback`. */
export function clamp(n: number, min: number, max: number, fallback = min): number {
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}

/** Validates an untrusted profile (e.g. from localStorage) against the allowed values. */
export function cleanProfile(raw: unknown, fb: Profile): Profile {
  if (!raw || typeof raw !== 'object') return fb
  const r = raw as Record<string, unknown>
  const pick = <T extends string>(v: unknown, allowed: readonly T[], d: T): T => (allowed.includes(v as T) ? (v as T) : d)
  return {
    name: sanitizeText(r.name, 40).trim() || fb.name,
    level: pick<Level>(r.level, LEVELS, fb.level),
    field: pick(r.field, FIELDS.slice(1), fb.field),
    country: pick(r.country, COUNTRIES.slice(1), fb.country),
    gpa: clamp(Number(r.gpa), 0, 4, fb.gpa),
    income: clamp(Number(r.income), 0, 10_000_000, fb.income),
  }
}

/** Keeps only known scholarships, valid statuses and known document names. */
export function cleanApps(raw: unknown): Record<string, AppEntry> {
  const out: Record<string, AppEntry> = {}
  if (!raw || typeof raw !== 'object') return out
  for (const s of SCHOLARSHIPS) {
    const e = (raw as Record<string, { status?: unknown; checked?: unknown } | undefined>)[s.id]
    if (!e || !STATUSES.includes(e.status as Status)) continue
    const checked = Array.isArray(e.checked) ? e.checked.filter((d): d is string => typeof d === 'string' && s.docs.includes(d)) : []
    out[s.id] = { status: e.status as Status, checked }
  }
  return out
}
