import { Component } from 'react'
import type { ReactNode } from 'react'
import { useT } from '../lib/i18n'

export function CrashNotice() {
  const t = useT()
  return <p role="alert" className="panel m-4 p-4 font-semibold">{t('crash')}</p>
}

interface Props { children: ReactNode; fallback?: ReactNode }

/** Catches render errors (including WebGL failures) so the rest of the app keeps working. */
export default class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: unknown) { console.error(error) }
  render() { return this.state.failed ? (this.props.fallback ?? <CrashNotice />) : this.props.children }
}
