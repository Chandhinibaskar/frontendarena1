import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import ErrorBoundary from './ErrorBoundary'
import { useStore } from '../store/useStore'
import { renderAt } from '../test/utils'

vi.mock('../scene/World', () => ({ default: () => null }))

const app = (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<h1>home</h1>} />
      <Route path="tracker" element={<h1>tracker</h1>} />
    </Route>
  </Routes>
)

describe('Layout', () => {
  it('has a skip link, labelled navigation and a focusable main', async () => {
    renderAt(app)
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'home' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1')
  })
  it('marks the current page and updates the document title', async () => {
    renderAt(app, '/tracker')
    expect(screen.getByRole('link', { name: 'Tracker' })).toHaveAttribute('aria-current', 'page')
    await waitFor(() => expect(document.title).toBe('Tracker · GRANTLY'))
  })
  it('switches language and text direction', async () => {
    renderAt(app)
    await userEvent.selectOptions(screen.getByLabelText('Language'), 'ar')
    expect(useStore.getState().lang).toBe('ar')
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')
    expect(screen.getByRole('link', { name: 'لوحة التحكم' })).toBeInTheDocument()
    await userEvent.selectOptions(screen.getByLabelText('اللغة'), 'hi')
    expect(document.documentElement.dir).toBe('ltr')
  })
})

describe('ErrorBoundary', () => {
  it('shows a fallback instead of crashing', () => {
    const Boom = () => { throw new Error('boom') }
    vi.spyOn(console, 'error').mockImplementation(() => {})
    renderAt(<ErrorBoundary><Boom /></ErrorBoundary>)
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
  })
})
