import {Size} from '../../kit_listing'
export function sizeToSymbol(size: Size): string {
  const symbols: Record<Size, string> = {'xsmall': 'XS', 'small': 'S', 'medium': 'M',
    'large': 'L', 'xlarge': 'XL'}
  return symbols[size.toLowerCase() as Size];
}

export function formatDate(date: Date): string {
  const now = new Date()
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  if (isToday) return 'Today'
  const isThisYear = date.getFullYear() === now.getFullYear()
  if (isThisYear) {
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
  }
  const yearsAgo = now.getFullYear() - date.getFullYear()
  return `${String(yearsAgo)} year${yearsAgo === 1 ? '' : 's'} ago`
}