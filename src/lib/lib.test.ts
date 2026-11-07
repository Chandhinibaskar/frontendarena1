import { describe, expect, it } from 'vitest'
import { SCHOLARSHIPS } from '../data/scholarships'
import type { Profile } from '../types'
import { checks, fmtDate, money, score } from './match'
import { clamp, cleanApps, cleanProfile, sanitizeText } from './sanitize'
import { DICT } from './i18n'

const profile: Profile = { name: 'Test', level: 'Undergraduate', field: 'Engineering', country: 'India', gpa: 3.4, income: 30000 }
const byId = (id: string) => SCHOLARSHIPS.find((s) => s.id === id)!

describe('match scoring', () => {
  it('gives 100% when every check passes', () => expect(score(byId('s4'), profile)).toBe(100))
  it('drops the weight of each failed check', () => {
    expect(score(byId('s2'), profile)).toBe(85) // country mismatch (-15)
    expect(score(byId('s1'), profile)).toBe(55) // level (-30) and GPA (-15)
  })
  it('returns the five labelled checks', () => {
    expect(checks(byId('s1'), profile).map(([k]) => k)).toEqual(['level', 'field', 'country', 'elig_gpa', 'elig_income'])
  })
  it('is always between 0 and 100', () => {
    for (const s of SCHOLARSHIPS) {
      expect(score(s, profile)).toBeGreaterThanOrEqual(0)
      expect(score(s, profile)).toBeLessThanOrEqual(100)
    }
  })
  it('formats money and dates', () => {
    expect(money(12000)).toBe('$12,000')
    expect(fmtDate(0, 'en')).toMatch(/\d/)
  })
})

describe('sanitization', () => {
  it('removes html tags and angle brackets', () => {
    const out = sanitizeText('<script>alert(1)</script>Ann <b>Lee</b>')
    expect(out).not.toMatch(/[<>]/)
    expect(out).toContain('Ann')
  })
  it('strips control characters, collapses spaces and limits length', () => {
    expect(sanitizeText('a\u0000b   c')).toBe('ab c')
    expect(sanitizeText('x'.repeat(100), 10)).toHaveLength(10)
    expect(sanitizeText(undefined)).toBe('')
  })
  it('clamps numbers and handles NaN', () => {
    expect(clamp(9, 0, 4)).toBe(4)
    expect(clamp(-1, 0, 4)).toBe(0)
    expect(clamp(NaN, 0, 4, 2)).toBe(2)
  })
  it('rejects invalid profile values', () => {
    const p = cleanProfile({ name: '<i>', level: 'Hacker', field: 'x', country: 'y', gpa: 99, income: -5 }, profile)
    expect(p).toMatchObject({ name: 'Test', level: 'Undergraduate', field: 'Engineering', country: 'India', gpa: 4, income: 0 })
  })
  it('keeps only known scholarships, statuses and documents', () => {
    const apps = cleanApps({ s1: { status: 'saved', checked: ['Government ID', '<x>', 5] }, evil: { status: 'saved' }, s2: { status: 'hacked' } })
    expect(apps).toEqual({ s1: { status: 'saved', checked: ['Government ID'] } })
  })
})

describe('translations', () => {
  it('has all six languages for every key', () => {
    for (const [key, values] of Object.entries(DICT)) {
      expect(values, key).toHaveLength(6)
      values.forEach((v) => expect(v.trim(), key).not.toBe(''))
    }
  })
})
