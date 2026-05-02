import {Size} from '../../kit_listing'
export function sizeToSymbol(size: Size): string {
  const symbols: Record<Size, string> = {'xsmall': 'XS', 'small': 'S', 'medium': 'M',
    'large': 'L', 'xlarge': 'XL'}
  return symbols[size];
}