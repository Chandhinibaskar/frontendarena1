import { useId } from 'react'

interface Option { value: string; label: string }
interface Props { label: string; value: string; onChange: (value: string) => void; options: Option[]; className?: string }

/** Labelled native <select>. Defined at module level so it keeps focus across parent re-renders. */
export default function Select({ label, value, onChange, options, className = '' }: Props) {
  const id = useId()
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>{label}</label>
      <select id={id} className="field font-normal" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}
