import { describe, expect, it } from 'vitest'
import { useStore } from './useStore'

const s = () => useStore.getState()

describe('store', () => {
  it('saves a scholarship and rewards coins once', () => {
    s().save('s1')
    expect(s().apps.s1).toEqual({ status: 'saved', checked: [] })
    expect(s().coins).toBe(105)
    s().save('s1')
    s().remove('s1')
    s().save('s1')
    expect(s().coins).toBe(105) // no farming
  })
  it('awards progress, submitted and awarded rewards once each', () => {
    s().setStatus('s2', 'progress')
    s().setStatus('s2', 'submitted')
    s().setStatus('s2', 'progress')
    s().setStatus('s2', 'submitted')
    expect(s().coins).toBe(100 + 20 + 50)
    s().setStatus('s2', 'awarded')
    expect(s().coins).toBe(370)
  })
  it('toggles documents and ignores unknown applications', () => {
    s().save('s3')
    s().toggleDoc('s3', 'CV')
    expect(s().apps.s3.checked).toEqual(['CV'])
    s().toggleDoc('s3', 'CV')
    expect(s().apps.s3.checked).toEqual([])
    s().toggleDoc('nope', 'CV')
    expect(s().apps.nope).toBeUndefined()
  })
  it('sanitizes the profile on update', () => {
    s().setProfile({ ...s().profile, name: '<b>Zed</b>', gpa: 12 })
    expect(s().profile.name).toBe('Zed')
    expect(s().profile.gpa).toBe(4)
  })
  it('validates tampered localStorage on load', async () => {
    localStorage.setItem('grantly-store', JSON.stringify({
      state: { lang: 'xx', profile: { name: '<img src=x onerror=alert(1)>', level: 'Hacker', gpa: 99 }, coins: 'lots',
        apps: { s1: { status: 'saved', checked: ['<x>', 'Government ID'] }, evil: { status: 'saved' } } },
      version: 0,
    }))
    await useStore.persist.rehydrate()
    expect(s().lang).toBe('en')
    expect(s().profile.name).toBe('Scholar')
    expect(s().profile.level).toBe('Undergraduate')
    expect(s().profile.gpa).toBe(4)
    expect(s().coins).toBe(100)
    expect(Object.keys(s().apps)).toEqual(['s1'])
    expect(s().apps.s1.checked).toEqual(['Government ID'])
  })
})
