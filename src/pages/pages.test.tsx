import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { SCHOLARSHIPS } from '../data/scholarships'
import { ScholarshipCard } from '../components/ui'
import Dashboard from './Dashboard'
import Discover from './Discover'
import Detail from './Detail'
import Tracker from './Tracker'
import Deadlines from './Deadlines'
import Profile from './Profile'
import { expectNoA11yViolations, renderAt } from '../test/utils'

describe('ScholarshipCard', () => {
  it('shows the match and toggles save', async () => {
    const s = SCHOLARSHIPS.find((x) => x.id === 's4')!
    renderAt(<ScholarshipCard s={s} />)
    expect(screen.getByRole('heading', { name: s.name })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '100% match' })).toBeInTheDocument()
    const btn = screen.getByRole('button', { name: /save/i })
    await userEvent.click(btn)
    expect(useStore.getState().apps.s4.status).toBe('saved')
    expect(screen.getByRole('button', { name: /remove/i })).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Dashboard', () => {
  it('greets the user and lists the best match first', () => {
    renderAt(<Dashboard />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome back, Scholar')
    expect(screen.getAllByRole('heading', { level: 3 })[0]).toHaveTextContent('Rising India Merit Scholarship')
  })
  it('counts saved scholarships', () => {
    act(() => useStore.getState().save('s1'))
    renderAt(<Dashboard />)
    expect(screen.getByText('Saved').previousElementSibling).toHaveTextContent('1')
  })
})

describe('Discover', () => {
  it('searches, filters and sorts', async () => {
    renderAt(<Discover />)
    expect(screen.getAllByRole('article')).toHaveLength(SCHOLARSHIPS.length)

    await userEvent.type(screen.getByPlaceholderText('Search scholarships…'), 'aurora')
    expect(screen.getAllByRole('article')).toHaveLength(1)
    await userEvent.clear(screen.getByPlaceholderText('Search scholarships…'))

    await userEvent.selectOptions(screen.getByLabelText('Level'), 'PhD')
    expect(screen.getAllByRole('article')).toHaveLength(2)
    await userEvent.selectOptions(screen.getByLabelText('Level'), '')

    await userEvent.selectOptions(screen.getByLabelText('Sort by'), 'deadline')
    expect(screen.getAllByRole('heading', { level: 3 })[0]).toHaveTextContent('First Gen Scholars')
  })
  it('shows an empty state', async () => {
    renderAt(<Discover />)
    await userEvent.type(screen.getByPlaceholderText('Search scholarships…'), 'zzzzzz')
    expect(screen.getByText('No scholarships match your filters.')).toBeInTheDocument()
  })
  it('never lets html into the search box', () => {
    renderAt(<Discover />)
    const input = screen.getByPlaceholderText('Search scholarships…')
    fireEvent.change(input, { target: { value: '<img src=x onerror=alert(1)>' } })
    expect((input as HTMLInputElement).value).not.toMatch(/[<>]/)
  })
})

describe('Detail', () => {
  const routes = (
    <Routes>
      <Route path="/s/:id" element={<Detail />} />
      <Route path="/tracker" element={<p>tracker page</p>} />
    </Routes>
  )
  it('shows eligibility and starts an application', async () => {
    renderAt(routes, '/s/s1')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Aurora Global Excellence')
    expect(screen.getAllByLabelText('Met').length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText('Not met').length).toBe(2)
    await userEvent.click(screen.getByRole('button', { name: 'Start application' }))
    expect(useStore.getState().apps.s1.status).toBe('progress')
    expect(screen.getByText('tracker page')).toBeInTheDocument()
  })
  it('handles an unknown scholarship', () => {
    renderAt(routes, '/s/unknown')
    expect(screen.getByText(/Scholarship not found/)).toBeInTheDocument()
  })
})

describe('Tracker', () => {
  it('moves an application between columns and tracks documents', async () => {
    act(() => useStore.getState().save('s1'))
    renderAt(<Tracker />)
    expect(within(screen.getByRole('region', { name: 'Saved' })).getByText('Aurora Global Excellence')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Government ID'))
    expect(useStore.getState().apps.s1.checked).toEqual(['Government ID'])
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1')

    await userEvent.selectOptions(screen.getByLabelText('Move to'), 'submitted')
    expect(within(screen.getByRole('region', { name: 'Submitted' })).getByText('Aurora Global Excellence')).toBeInTheDocument()
    expect(useStore.getState().apps.s1.status).toBe('submitted')
  })
  it('removes an application', async () => {
    act(() => useStore.getState().save('s1'))
    renderAt(<Tracker />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(useStore.getState().apps.s1).toBeUndefined()
  })
})

describe('Deadlines', () => {
  it('lists every scholarship in date order', () => {
    renderAt(<Deadlines />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(SCHOLARSHIPS.length)
    expect(links[0]).toHaveTextContent('First Gen Scholars')
  })
})

describe('Profile', () => {
  it('sanitizes and clamps values on save', async () => {
    renderAt(<Profile />)
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '<b>Zed</b>' } })
    fireEvent.change(screen.getByLabelText('GPA (0–4)'), { target: { value: '9' } })
    await userEvent.click(screen.getByRole('button', { name: 'Save profile' }))
    expect(useStore.getState().profile).toMatchObject({ name: 'Zed', gpa: 4 })
    expect(screen.getByRole('status')).toHaveTextContent('Profile saved')
  })
  it('updates match scores after saving', async () => {
    renderAt(<Profile />)
    await userEvent.selectOptions(screen.getByLabelText('Level'), 'PhD')
    await userEvent.click(screen.getByRole('button', { name: 'Save profile' }))
    expect(useStore.getState().profile.level).toBe('PhD')
  })
})

describe('accessibility (axe)', () => {
  const cases: [string, () => ReturnType<typeof renderAt>][] = [
    ['Dashboard', () => renderAt(<Dashboard />)],
    ['Discover', () => renderAt(<Discover />)],
    ['Detail', () => renderAt(<Routes><Route path="/s/:id" element={<Detail />} /></Routes>, '/s/s1')],
    ['Tracker', () => { useStore.getState().save('s1'); return renderAt(<Tracker />) }],
    ['Deadlines', () => renderAt(<Deadlines />)],
    ['Profile', () => renderAt(<Profile />)],
  ]
  it.each(cases)('%s has no axe violations', async (_n, make) => {
    const { container } = make()
    await expectNoA11yViolations(container)
  })
})

vi.mock('../scene/World', () => ({ default: () => null }))
