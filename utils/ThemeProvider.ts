import { createContext } from 'react'

export const Theme = createContext<
  ['light' | 'dark', (theme: 'light' | 'dark') => void] | null
>(null)
