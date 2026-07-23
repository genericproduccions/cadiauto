import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error, fallback = 'Alguna cosa ha anat malament.') {
  const data = error?.response?.data
  if (!data) return fallback
  if (data.errors) {
    const firstError = Object.values(data.errors)[0]
    if (Array.isArray(firstError) && firstError[0]) return firstError[0]
  }
  return data.message ?? fallback
}
