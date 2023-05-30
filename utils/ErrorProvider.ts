import { createContext } from 'react'

export const Error =
  createContext<
    (
      type: 'success' | 'warn' | 'error',
      title: string,
      description?: string
    ) => void | null
  >(null)
