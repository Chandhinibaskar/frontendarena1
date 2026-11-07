export type Level = 'Undergraduate' | 'Postgraduate' | 'PhD'
export const STATUSES = ['saved', 'progress', 'submitted', 'awarded', 'rejected'] as const
export type Status = (typeof STATUSES)[number]
export const LANG_CODES = ['en', 'hi', 'ta', 'es', 'fr', 'ar'] as const
export type Lang = (typeof LANG_CODES)[number]

export interface Scholarship {
  id: string; name: string; provider: string; country: string; level: Level; field: string
  amount: number; days: number; minGpa: number; maxIncome: number
  description: string; docs: string[]; steps: string[]
}
export interface Profile { name: string; level: Level; field: string; country: string; gpa: number; income: number }
export interface AppEntry { status: Status; checked: string[] }
