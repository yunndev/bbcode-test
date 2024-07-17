export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { timeZone: 'GMT' })
}
